package myJournal.app.controller;

import myJournal.app.model.dto.JournalDto;
import myJournal.app.repository.JournalRepository;
import myJournal.app.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private JournalService journalService;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        List<Object[]> lightweightTrades = journalRepository.findAllLightweight();

        int totalTrades = lightweightTrades.size();

        double totalPnl = lightweightTrades.stream()
                .map(row -> (Double) row[4])
                .mapToDouble(pnl -> pnl != null ? pnl : 0.0)
                .sum();

        long wins = lightweightTrades.stream()
                .map(row -> (Double) row[4])
                .filter(pnl -> pnl != null && pnl > 0)
                .count();

        double winRate = totalTrades > 0 ? ((double) wins / totalTrades) * 100 : 0.0;

        double grossProfit = lightweightTrades.stream()
                .map(row -> (Double) row[4])
                .filter(pnl -> pnl != null && pnl > 0)
                .mapToDouble(pnl -> pnl)
                .sum();

        double grossLoss = lightweightTrades.stream()
                .map(row -> (Double) row[4])
                .filter(pnl -> pnl != null && pnl < 0)
                .mapToDouble(Math::abs)
                .sum();

        double profitFactor = 0.0;
        if (grossLoss == 0) {
            profitFactor = grossProfit > 0 ? grossProfit : 0.0;
        } else {
            profitFactor = grossProfit / grossLoss;
        }

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalTrades", totalTrades);
        metrics.put("totalPnl", totalPnl);
        metrics.put("winRate", winRate);
        metrics.put("profitFactor", profitFactor);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/recent-trades")
    public ResponseEntity<List<JournalDto>> getRecentTrades() {
        List<JournalDto> recentTrades = journalService.getAllTrades().stream()
                .sorted(Comparator.comparing(JournalDto::getTradeTime, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(recentTrades);
    }

    @GetMapping("/all-trades")
    public ResponseEntity<List<JournalDto>> getAllTradesForChart() {
        List<JournalDto> allTrades = journalRepository.findAllLightweight().stream()
                .map(row -> {
                    JournalDto dto = new JournalDto();
                    dto.setId((Long) row[0]);
                    dto.setSymbol((String) row[1]);
                    dto.setType((String) row[2]);
                    dto.setTradeTime((LocalDateTime) row[3]);
                    dto.setPnl((Double) row[4]);
                    dto.setSetup((String) row[5]);
                    dto.setConfidence((Integer) row[6]);
                    dto.setDate((String) row[7]);
                    dto.setImages(null);
                    return dto;
                })
                .sorted(Comparator.comparing(JournalDto::getTradeTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(allTrades);
    }
}