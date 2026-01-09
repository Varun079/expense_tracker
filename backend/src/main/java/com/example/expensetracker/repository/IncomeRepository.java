package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Income;
import com.example.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser(User user);
}
