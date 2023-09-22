package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.review.ReviewRequestDTO;
import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import static com.amychong.tourmanagementapp.mapper.BookingMapper.mapToBooking;

@Mapper(componentModel="spring", uses = UserMapper.class)
public interface ReviewMapper extends GenericMapper<Review, ReviewResponseDTO> {

    @Override
    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "booking.user.id", target = "userId")
    @Mapping(source = "booking.user.name", target = "userName")
    @Mapping(source = "booking.user.active", target = "userActive")
    @Mapping(source = "booking.user.role", target = "userRole")
    @Mapping(source = "booking.tourStartDate.tour.id", target = "tourId")
    @Mapping(source = "booking.tourStartDate.tour.name", target = "tourName")
    @Mapping(source = "booking.tourStartDate.tour.duration", target = "tourDuration")
    @Mapping(source = "booking.tourStartDate.tour.region", target = "tourRegion")
    @Mapping(source = "booking.tourStartDate.startDate.id", target = "startDateId")
    @Mapping(source = "booking.tourStartDate.startDate.startDateTime", target = "startDateTime")
    ReviewResponseDTO toDTO(Review review);

    default Review toReview(ReviewRequestDTO requestBody, EntityLookup entityLookup) {
        Review review = new Review();
        review.setReview(requestBody.getReview());
        review.setRating(requestBody.getRating());
        review.setBooking(mapToBooking(requestBody.getBookingId(), entityLookup));
        return review;
    }
}
