package myJournal.app.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "journals")
public class Journal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String type; // 'LONG' or 'SHORT'

    @Column(nullable = false)
    private LocalDateTime tradeTime;

    @Column(nullable = false)
    private Double pnl;

    @Column(nullable = false)
    private String setup;

    @Column(nullable = false)
    private Integer confidence;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private String date;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "journal_id")
    private List<JournalImage> images = new ArrayList<>();
}