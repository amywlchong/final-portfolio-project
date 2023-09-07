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
    @Transactional
    public TourGuideScheduleDTO create(TourGuideSchedule inputTourGuideSchedule) {
        if (inputTourGuideSchedule == null) {
            throw new IllegalArgumentException("Tour guide schedule must not be null.");
        }

        TourGuideSchedule copyOfInputSchedule = inputTourGuideSchedule.deepCopy();

        Integer inputUserId = Optional.ofNullable(copyOfInputSchedule.getUser())
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User id must not be null."));
        Integer inputTourId = Optional.ofNullable(copyOfInputSchedule.getTour())
                .map(Tour::getId)
                .orElseThrow(() -> new IllegalArgumentException("Tour id must not be null."));
        LocalDateTime inputStartDateTime = Optional.ofNullable(copyOfInputSchedule.getStartDate())
                .map(StartDate::getStartDateTime)
                .orElseThrow(() -> new IllegalArgumentException("Start date time must not be null."));

        UserDTO existingUser = userService.findById(inputUserId);
        if (existingUser == null) {
            throw new RuntimeException("User does not exist.");
        }
        if (!existingUser.getUserRole().equals("ROLE_GUIDE") && !existingUser.getUserRole().equals("ROLE_LEAD_GUIDE")) {
            throw new RuntimeException("User is not a guide or lead guide.");
        }
        TourStartDate existingTourStartDate = tourStartDateRepository.findByTour_IdAndStartDate_StartDateTime(inputTourId, inputStartDateTime);
        if (existingTourStartDate == null) {
            throw new RuntimeException("Tour-startDate pair does not exist.");
        }

        copyOfInputSchedule.getStartDate().setId(existingTourStartDate.getStartDate().getId());

        return super.create(copyOfInputSchedule);
    }

}
