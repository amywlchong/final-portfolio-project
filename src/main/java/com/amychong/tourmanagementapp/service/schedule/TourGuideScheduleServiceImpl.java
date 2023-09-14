package com.amychong.tourmanagementapp.service.schedule;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.mapper.TourGuideScheduleMapper;
import com.amychong.tourmanagementapp.repository.schedule.TourGuideScheduleRepository;
import com.amychong.tourmanagementapp.service.helper.TourStartDateHelper;
import com.amychong.tourmanagementapp.service.helper.UserHelper;
import com.amychong.tourmanagementapp.service.tour.TourStartDateService;
import com.amychong.tourmanagementapp.service.user.UserService;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TourGuideScheduleServiceImpl extends GenericServiceImpl<TourGuideSchedule, TourGuideScheduleDTO> implements TourGuideScheduleService {

    private TourGuideScheduleRepository tourGuideScheduleRepository;
    private TourGuideScheduleMapper tourGuideScheduleMapper;
    private UserService userService;
    private TourStartDateService tourStartDateService;

    @Autowired
    public TourGuideScheduleServiceImpl(TourGuideScheduleRepository theTourGuideScheduleRepository, TourGuideScheduleMapper theTourGuideScheduleMapper, UserService theUserService, TourStartDateService theTourStartDateService) {
        super(theTourGuideScheduleRepository, theTourGuideScheduleMapper, TourGuideSchedule.class, TourGuideScheduleDTO.class);
        tourGuideScheduleRepository = theTourGuideScheduleRepository;
        tourGuideScheduleMapper = theTourGuideScheduleMapper;
        userService = theUserService;
        tourStartDateService = theTourStartDateService;
    }

    @Override
    public List<TourGuideScheduleDTO> findAll() {
        return tourGuideScheduleRepository.findAllDTO();
    }

    @Override
    @Transactional
    public TourGuideScheduleDTO create(TourGuideSchedule inputTourGuideSchedule) {
        ValidationHelper.validateNotNull(inputTourGuideSchedule, "Tour guide schedule must not be null.");
        Integer userId = UserHelper.extractUserId(inputTourGuideSchedule);
        userService.validateUserRole(userId, "User must be a guide or lead guide", "ROLE_GUIDE", "ROLE_LEAD_GUIDE");

        Integer inputTourId = TourStartDateHelper.extractTourId(inputTourGuideSchedule);
        LocalDateTime inputStartDateTime = TourStartDateHelper.extractStartDateTime(inputTourGuideSchedule);
        TourStartDate dbTourStartDate = tourStartDateService.validateTourStartDateAndFindFromDB(inputTourId, inputStartDateTime);

        TourGuideSchedule copyOfInputSchedule = inputTourGuideSchedule.deepCopy();
        copyOfInputSchedule.setTourStartDate(dbTourStartDate);

        return super.create(copyOfInputSchedule);
    }
}
