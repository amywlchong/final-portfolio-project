package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
