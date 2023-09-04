package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name="tour_images")
public class TourImage implements Identifiable<Integer> {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="file_name")
    private String fileName;

    @Column(name="is_cover")
    private boolean isCover = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="tour_id")
    private Tour tour;

    // define constructors
    public TourImage() {

    }

    public TourImage(String fileName, boolean isCover, Tour tour) {
        this.fileName = fileName;
        this.isCover = isCover;
        this.tour = tour;
    }

    // define getters and setters

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public boolean isCover() {
        return isCover;
    }

    public void setCover(boolean cover) {
        isCover = cover;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    // define toString method

    @Override
    public String toString() {
        return "TourImage{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", isCover=" + isCover +
                '}';
    }
}
