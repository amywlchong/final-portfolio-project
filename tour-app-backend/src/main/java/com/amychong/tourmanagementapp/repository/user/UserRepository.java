package com.amychong.tourmanagementapp.repository.user;

import com.amychong.tourmanagementapp.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);

  @Query(
      "SELECT u FROM User u "
          + "LEFT JOIN TourGuideSchedule tgs ON tgs.user.id = u.id "
          + "LEFT JOIN tgs.tourStartDate tsd "
          + "LEFT JOIN tsd.tour t "
          + "LEFT JOIN tsd.startDate sd "
          + "WHERE u.role IN ('ROLE_GUIDE', 'ROLE_LEAD_GUIDE') "
          + "AND u.active = true "
          + "GROUP BY u.id "
          + "HAVING SUM(CASE "
          + "WHEN (DATE(sd.startDateTime) <= :endDate AND ADDDATE(DATE(sd.startDateTime), (t.duration - 1)) >= :startDate) THEN 1 "
          + "ELSE 0 END) = 0")
  List<User> findAvailableGuidesWithinRange(
      @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
