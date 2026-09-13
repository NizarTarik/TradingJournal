package myJournal.app.controller;

import myJournal.app.entity.Journal;
import myJournal.app.model.dto.JournalDto;
import myJournal.app.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
@CrossOrigin(origins = "http://localhost:4200")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @GetMapping
    public List<JournalDto> getAllTrades() {
        return journalService.getAllTrades();
    }

    @PostMapping
    public ResponseEntity<JournalDto> createTrade(@RequestBody JournalDto journal) {
        JournalDto savedJournal = journalService.createTrade(journal);
        return ResponseEntity.ok(savedJournal);
    }
}