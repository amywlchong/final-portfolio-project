package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.mapper.TourGuideScheduleMapper;
import com.amychong.tourmanagementapp.repository.TourGuideScheduleRepository;
import com.amychong.tourmanagementapp.repository.TourStartDateRepository;
import com.amychong.tourmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TourGuideScheduleServiceImpl extends GenericServiceImpl<TourGuideSchedule, TourGuideScheduleDTO> implements TourGuideScheduleService {

    private TourGuideScheduleRepository tourGuideScheduleRepository;
    private TourGuideScheduleMapper tourGuideScheduleMapper;
    private UserRepository userRepository;
    private TourStartDateRepository tourStartDateRepository;

    @Autowired
    public TourGuideScheduleServiceImpl(TourGuideScheduleRepository theTourGuideScheduleRepository, TourGuideScheduleMapper theTourGuideScheduleMapper, UserRepository theUserRepository, TourStartDateRepository theTourStartDateRepository) {
        super(theTourGuideScheduleRepository, theTourGuideScheduleMapper, TourGuideSchedule.class, TourGuideScheduleDTO.class);
        tourGuideScheduleRepository = theTourGuideScheduleRepository;
        tourGuideScheduleMapper = theTourGuideScheduleMapper;
        userRepository = theUserRepository;
        tourStartDateRepository = theTourStartDateRepository;
    }

    @Override
    public List<TourGuideScheduleDTO> findAll() {
        return tourGuideScheduleRepository.findAllDTO();
    }

    @Override
    @Transactional
    public TourGuideScheduleDTO create(TourGuideSchedule inputTourGuideSchedule) {
        super.validateNotNull(inputTourGuideSchedule, "Tour guide schedule must not be null.");
        Integer userId = UserHelper.extractUserId(inputTourGuideSchedule);
        UserHelper.validateUserRole(userId, userRepository, "User must be a guide or lead guide", "ROLE_GUIDE", "ROLE_LEAD_GUIDE");

        Integer inputTourId = TourStartDateHelper.extractTourId(inputTourGuideSchedule);
        LocalDateTime inputStartDateTime = TourStartDateHelper.extractStartDateTime(inputTourGuideSchedule);
        TourStartDate dbTourStartDate = TourStartDateHelper.validateTourStartDateAndFindFromDB(inputTourId, inputStartDateTime, tourStartDateRepository);

        TourGuideSchedule copyOfInputSchedule = inputTourGuideSchedule.deepCopy();
        copyOfInputSchedule.setTourStartDate(dbTourStartDate);

        return super.create(copyOfInputSchedule);
    }
}
