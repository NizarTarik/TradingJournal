package myJournal.app.service;

import myJournal.app.model.dto.JournalDto;

import java.util.List;

public interface JournalService {
    List<JournalDto> getAllTrades();

    JournalDto createTrade(JournalDto journal);
}