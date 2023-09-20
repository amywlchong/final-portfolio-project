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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TourGuideScheduleServiceImpl extends GenericServiceImpl<TourGuideSchedule, TourGuideScheduleDTO> implements TourGuideScheduleService {

    private final TourGuideScheduleRepository tourGuideScheduleRepository;
    private final TourGuideScheduleMapper tourGuideScheduleMapper;
    private final UserService userService;
    private final TourStartDateService tourStartDateService;

    @Autowired
    public TourGuideScheduleServiceImpl(TourGuideScheduleRepository theTourGuideScheduleRepository, TourGuideScheduleMapper theTourGuideScheduleMapper, UserService theUserService, TourStartDateService theTourStartDateService) {
        super(theTourGuideScheduleRepository, TourGuideSchedule.class, TourGuideScheduleDTO.class, theTourGuideScheduleMapper);
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
    public List<TourGuideScheduleDTO> findByUserId(Integer theUserId) {
        ValidationHelper.validateId(theUserId);

        return tourGuideScheduleRepository.findByUserId(theUserId);
    }

    @Override
    public List<TourGuideScheduleDTO> findByTourId(Integer theTourId) {
        ValidationHelper.validateId(theTourId);

        return tourGuideScheduleRepository.findByTourId(theTourId);
    }

    @Override
    public List<TourGuideScheduleDTO> findSchedulesWithinRange(LocalDate startDate, LocalDate endDate) {
        ValidationHelper.validateNotNull(startDate, "startDate must not be null.");
        ValidationHelper.validateNotNull(endDate, "endDate must not be null.");

        return tourGuideScheduleRepository.findSchedulesWithinRange(startDate, endDate);
    }

    @Override
    @Transactional
    public TourGuideScheduleDTO create(TourGuideSchedule inputTourGuideSchedule) {
        ValidationHelper.validateNotNull(inputTourGuideSchedule, "Tour guide schedule must not be null.");
        Integer userId = UserHelper.extractUserId(inputTourGuideSchedule);
        if (!userService.verifyInputUserHasRole(userId, "ROLE_GUIDE", "ROLE_LEAD_GUIDE")) {
            throw new RuntimeException("User associated with schedule must be a guide or lead guide");
        }

        Integer inputTourId = TourStartDateHelper.extractTourId(inputTourGuideSchedule);
        LocalDateTime inputStartDateTime = TourStartDateHelper.extractStartDateTime(inputTourGuideSchedule);
        TourStartDate dbTourStartDate = tourStartDateService.validateTourStartDateAndFindFromDB(inputTourId, inputStartDateTime);

        TourGuideSchedule copyOfInputSchedule = inputTourGuideSchedule.deepCopy();
        copyOfInputSchedule.setTourStartDate(dbTourStartDate);

        return super.create(copyOfInputSchedule);
    }
}
