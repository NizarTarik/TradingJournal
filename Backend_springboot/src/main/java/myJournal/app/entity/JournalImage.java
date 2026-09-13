package myJournal.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "journal_images")
public class JournalImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

}