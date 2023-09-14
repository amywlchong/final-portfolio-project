package com.amychong.tourmanagementapp.repository.user;

import com.amychong.tourmanagementapp.entity.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    UserRole findByRole(String role);
}
