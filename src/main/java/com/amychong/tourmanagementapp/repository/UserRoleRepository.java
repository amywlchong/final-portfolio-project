package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    UserRole findByRole(String role);
}
