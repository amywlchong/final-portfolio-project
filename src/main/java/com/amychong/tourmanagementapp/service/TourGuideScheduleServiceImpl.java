package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.mapper.TourGuideScheduleMapper;
import com.amychong.tourmanagementapp.repository.TourGuideScheduleRepository;
import com.amychong.tourmanagementapp.repository.TourStartDateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TourGuideScheduleServiceImpl extends GenericServiceImpl<TourGuideSchedule, TourGuideScheduleDTO> implements TourGuideScheduleService {

    private TourGuideScheduleRepository tourGuideScheduleRepository;
    private TourGuideScheduleMapper tourGuideScheduleMapper;
    private UserService userService;
    private TourStartDateRepository tourStartDateRepository;

    @Autowired
    public TourGuideScheduleServiceImpl(TourGuideScheduleRepository theTourGuideScheduleRepository, TourGuideScheduleMapper theTourGuideScheduleMapper, UserService theUserService, TourStartDateRepository theTourStartDateRepository) {
        super(theTourGuideScheduleRepository, theTourGuideScheduleMapper, TourGuideSchedule.class, TourGuideScheduleDTO.class);
        tourGuideScheduleRepository = theTourGuideScheduleRepository;
        tourGuideScheduleMapper = theTourGuideScheduleMapper;
        userService = theUserService;
        tourStartDateRepository = theTourStartDateRepository;
    }

    @Override
    public List<TourGuideScheduleDTO> findAll() {
        return tourGuideScheduleRepository.findAllDTO();
    }

    @Override
    @Transactional
    public TourGuideScheduleDTO create(TourGuideSchedule inputTourGuideSchedule) {
        validateInputSchedule(inputTourGuideSchedule);
        validateUser(extractUserId(inputTourGuideSchedule));
        TourStartDate existingTourStartDate = validateTourStartDate(extractTourId(inputTourGuideSchedule), extractStartDateTime(inputTourGuideSchedule));

        TourGuideSchedule copyOfInputSchedule = inputTourGuideSchedule.deepCopy();
        copyOfInputSchedule.getTourStartDate().setId(existingTourStartDate.getId());
        copyOfInputSchedule.getTourStartDate().getStartDate().setId(existingTourStartDate.getStartDate().getId());

        return super.create(copyOfInputSchedule);
    }

    private void validateInputSchedule(TourGuideSchedule inputTourGuideSchedule) {
        if (inputTourGuideSchedule == null) {
            throw new IllegalArgumentException("Tour guide schedule must not be null.");
        }
    }

    private Integer extractUserId(TourGuideSchedule schedule) {
        return Optional.ofNullable(schedule.getUser())
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User id must not be null."));
    }

    private Integer extractTourId(TourGuideSchedule schedule) {
        return Optional.ofNullable(schedule.getTourStartDate())
                .map(TourStartDate::getTour)
                .map(Tour::getId)
                .orElseThrow(() -> new IllegalArgumentException("Tour and tour id must not be null."));
    }

    private LocalDateTime extractStartDateTime(TourGuideSchedule schedule) {
        return Optional.ofNullable(schedule.getTourStartDate())
                .map(TourStartDate::getStartDate)
                .map(StartDate::getStartDateTime)
                .orElseThrow(() -> new IllegalArgumentException("Start date and start date time must not be null."));
    }

    private void validateUser(Integer userId) {
        UserDTO existingUser = userService.findById(userId);
        if (existingUser == null) {
            throw new RuntimeException("User does not exist.");
        }
        if (!existingUser.getUserRole().equals("ROLE_GUIDE") && !existingUser.getUserRole().equals("ROLE_LEAD_GUIDE")) {
            throw new RuntimeException("User is not a guide or lead guide.");
        }
    }

    private TourStartDate validateTourStartDate(Integer tourId, LocalDateTime startDateTime) {
        TourStartDate existingTourStartDate = tourStartDateRepository.findByTour_IdAndStartDate_StartDateTime(tourId, startDateTime);
        if (existingTourStartDate == null) {
            throw new RuntimeException("Tour-startDate pair does not exist.");
        }
        return existingTourStartDate;
    }
}
