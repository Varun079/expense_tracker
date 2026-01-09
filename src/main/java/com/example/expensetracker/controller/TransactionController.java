package com.example.expensetracker.controller;

import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Income;
import com.example.expensetracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // ----- Expenses -----

    @PostMapping("/expenses")
    public ResponseEntity<Expense> addExpense(Principal principal, @RequestBody Expense expense) {
        return ResponseEntity.ok(transactionService.addExpense(principal.getName(), expense));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> removeExpense(@PathVariable Long id) {
        transactionService.removeExpense(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses(
            Principal principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(transactionService.getExpenses(principal.getName(), category, startDate, endDate,
                minAmount, maxAmount, sortBy));
    }

    // ----- Incomes -----

    @PostMapping("/incomes")
    public ResponseEntity<Income> addIncome(Principal principal, @RequestBody Income income) {
        return ResponseEntity.ok(transactionService.addIncome(principal.getName(), income));
    }

    @DeleteMapping("/incomes/{id}")
    public ResponseEntity<Void> removeIncome(@PathVariable Long id) {
        transactionService.removeIncome(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/incomes")
    public ResponseEntity<List<Income>> getIncomes(
            Principal principal,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(transactionService.getIncomes(principal.getName(), source, startDate, endDate,
                minAmount, maxAmount, sortBy));
    }

    // ----- PnL -----

    @GetMapping("/pnl")
    public ResponseEntity<BigDecimal> getPnL(Principal principal) {
        return ResponseEntity.ok(transactionService.calculatePnL(principal.getName()));
    }
}
