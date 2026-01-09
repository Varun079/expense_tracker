package com.example.expensetracker.service;

import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Income;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.IncomeRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public Expense addExpense(String username, Expense expense) {
        User user = getUserByUsername(username);
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public Income addIncome(String username, Income income) {
        User user = getUserByUsername(username);
        income.setUser(user);
        return incomeRepository.save(income);
    }

    public void removeExpense(Long expenseId) {
        expenseRepository.deleteById(expenseId);
    }

    public void removeIncome(Long incomeId) {
        incomeRepository.deleteById(incomeId);
    }

    public List<Expense> getExpenses(String username, String category, LocalDate startDate, LocalDate endDate,
            BigDecimal minAmount, BigDecimal maxAmount, String sortBy) {
        User user = getUserByUsername(username);
        List<Expense> expenses = expenseRepository.findByUser(user);

        return expenses.stream()
                .filter(e -> category == null || e.getCategory().name().equalsIgnoreCase(category))
                .filter(e -> startDate == null || !e.getDate().isBefore(startDate))
                .filter(e -> endDate == null || !e.getDate().isAfter(endDate))
                .filter(e -> minAmount == null || e.getAmount().compareTo(minAmount) >= 0)
                .filter(e -> maxAmount == null || e.getAmount().compareTo(maxAmount) <= 0)
                .sorted(getExpenseComparator(sortBy))
                .collect(Collectors.toList());
    }

    public List<Income> getIncomes(String username, String source, LocalDate startDate, LocalDate endDate,
            BigDecimal minAmount, BigDecimal maxAmount, String sortBy) {
        User user = getUserByUsername(username);
        List<Income> incomes = incomeRepository.findByUser(user);

        return incomes.stream()
                .filter(i -> source == null || i.getSource().name().equalsIgnoreCase(source))
                .filter(i -> startDate == null || !i.getDate().isBefore(startDate))
                .filter(i -> endDate == null || !i.getDate().isAfter(endDate))
                .filter(i -> minAmount == null || i.getAmount().compareTo(minAmount) >= 0)
                .filter(i -> maxAmount == null || i.getAmount().compareTo(maxAmount) <= 0)
                .sorted(getIncomeComparator(sortBy))
                .collect(Collectors.toList());
    }

    public BigDecimal calculatePnL(String username) {
        User user = getUserByUsername(username);
        List<Expense> expenses = expenseRepository.findByUser(user);
        List<Income> incomes = incomeRepository.findByUser(user);

        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalIncome.subtract(totalExpense);
    }

    private Comparator<Expense> getExpenseComparator(String sortBy) {
        if ("amount".equalsIgnoreCase(sortBy)) {
            return Comparator.comparing(Expense::getAmount);
        } else if ("category".equalsIgnoreCase(sortBy)) {
            return Comparator.comparing(e -> e.getCategory().name());
        } else {
            return Comparator.comparing(Expense::getDate);
        }
    }

    private Comparator<Income> getIncomeComparator(String sortBy) {
        if ("amount".equalsIgnoreCase(sortBy)) {
            return Comparator.comparing(Income::getAmount);
        } else if ("source".equalsIgnoreCase(sortBy)) {
            return Comparator.comparing(i -> i.getSource().name());
        } else {
            return Comparator.comparing(Income::getDate);
        }
    }
}
