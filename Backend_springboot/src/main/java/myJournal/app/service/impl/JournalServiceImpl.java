package myJournal.app.service.impl;

import myJournal.app.entity.Journal;
import myJournal.app.model.dto.JournalDto;
import myJournal.app.model.mapper.JournalMapper;
import myJournal.app.repository.JournalRepository;
import myJournal.app.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JournalServiceImpl implements JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private JournalMapper journalMapper;

    @Override
    public List<JournalDto> getAllTrades() {
        return journalRepository.findAll().stream()
                .map(journalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public JournalDto createTrade(JournalDto journalDto) {
        Journal journal = journalMapper.toEntity(journalDto);
        Journal savedJournal = journalRepository.save(journal);
        return journalMapper.toDto(savedJournal);
    }
}