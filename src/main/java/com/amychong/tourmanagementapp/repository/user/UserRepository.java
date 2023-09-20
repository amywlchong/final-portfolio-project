package com.amychong.tourmanagementapp.repository.user;

import com.amychong.tourmanagementapp.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

}
