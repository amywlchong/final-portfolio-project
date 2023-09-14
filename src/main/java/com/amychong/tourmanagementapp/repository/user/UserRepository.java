package com.amychong.tourmanagementapp.repository.user;

import com.amychong.tourmanagementapp.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
