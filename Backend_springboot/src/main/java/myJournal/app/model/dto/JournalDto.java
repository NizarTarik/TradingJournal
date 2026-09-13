package myJournal.app.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalDto {
    private Long id;
    private String symbol;
    private String type;
    private LocalDateTime tradeTime;
    private Double pnl;
    private String setup;
    private Integer confidence;
    private String notes;
    private String date;
    private List<JournalImageDto> images;
}