package com.amychong.tourmanagementapp.service.schedule;

import com.amychong.tourmanagementapp.dto.schedule.ScheduleRequestDTO;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.mapper.TourGuideScheduleMapper;
import com.amychong.tourmanagementapp.repository.schedule.TourGuideScheduleRepository;
import com.amychong.tourmanagementapp.service.EntityLookup;
import com.amychong.tourmanagementapp.service.user.UserService;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourGuideScheduleServiceImpl
    extends GenericServiceImpl<TourGuideSchedule, ScheduleResponseDTO>
    implements TourGuideScheduleService {

  private final TourGuideScheduleRepository tourGuideScheduleRepository;
  private final TourGuideScheduleMapper tourGuideScheduleMapper;
  private final EntityLookup entityLookup;
  private final UserService userService;

  @Autowired
  public TourGuideScheduleServiceImpl(
      TourGuideScheduleRepository theTourGuideScheduleRepository,
      TourGuideScheduleMapper theTourGuideScheduleMapper,
      EntityLookup theEntityLookup,
      UserService theUserService) {
    super(
        theTourGuideScheduleRepository,
        TourGuideSchedule.class,
        ScheduleResponseDTO.class,
        theTourGuideScheduleMapper);
    tourGuideScheduleRepository = theTourGuideScheduleRepository;
    tourGuideScheduleMapper = theTourGuideScheduleMapper;
    entityLookup = theEntityLookup;
    userService = theUserService;
  }

  @Override
  public List<ScheduleResponseDTO> findAll() {
    return tourGuideScheduleRepository.findAllDTO();
  }

  @Override
  public List<ScheduleResponseDTO> findByUserId(Integer theUserId) {
    return tourGuideScheduleRepository.findByUserId(theUserId);
  }

  @Override
  public List<ScheduleResponseDTO> findByTourId(Integer theTourId) {
    return tourGuideScheduleRepository.findByTourId(theTourId);
  }

  @Override
  public List<ScheduleResponseDTO> findSchedulesWithinRange(
      LocalDate startDate, LocalDate endDate) {
    if (startDate.isAfter(endDate)) {
      throw new IllegalArgumentException("Start date cannot be after end date");
    }

    return tourGuideScheduleRepository.findSchedulesWithinRange(startDate, endDate);
  }

  @Override
  @Transactional
  public ScheduleResponseDTO create(ScheduleRequestDTO inputTourGuideSchedule) {
    validateUser(inputTourGuideSchedule);

    Integer inputTourId = inputTourGuideSchedule.getTourId();
    Tour dbTour = entityLookup.findTourByIdOrThrow(inputTourId);
    LocalDateTime inputStartDateTime = inputTourGuideSchedule.getStartDateTime();
    LocalDateTime endDateTime = inputStartDateTime.plusDays(dbTour.getDuration() - 1);

    entityLookup.findTourStartDateByTourIdAndStartDateTimeOrThrow(
        inputTourId, inputStartDateTime); // validate tour start date exists

    validateGuideIsAvailable(inputTourGuideSchedule.getUserId(), inputStartDateTime, endDateTime);

    TourGuideSchedule scheduleToBeAdded =
        tourGuideScheduleMapper.toTourGuideSchedule(inputTourGuideSchedule, entityLookup);

    return super.create(scheduleToBeAdded);
  }

  private void validateUser(ScheduleRequestDTO inputTourGuideSchedule) {
    Integer inputUserId = inputTourGuideSchedule.getUserId();

    if (!userService.verifyInputUserIsActive(inputUserId)) {
      throw new IllegalArgumentException("User associated with new schedule must be active");
    }
    if (!userService.verifyInputUserHasRole(inputUserId, "ROLE_GUIDE", "ROLE_LEAD_GUIDE")) {
      throw new IllegalArgumentException(
          "User associated with schedule must be a guide or lead guide");
    }
  }

  private void validateGuideIsAvailable(
      Integer inputUserId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
    List<Integer> availableGuideIds =
        userService
            .findAvailableGuidesWithinRange(startDateTime.toLocalDate(), endDateTime.toLocalDate())
            .stream()
            .map(guide -> guide.getId())
            .collect(Collectors.toList());
    if (!availableGuideIds.contains(inputUserId)) {
      throw new IllegalArgumentException("Guide is not available for the date range.");
    }
  }
}
