package myJournal.app.model.mapper;

import myJournal.app.entity.Journal;
import myJournal.app.entity.JournalImage;
import myJournal.app.model.dto.JournalDto;
import myJournal.app.model.dto.JournalImageDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JournalMapper {

    public JournalDto toDto(Journal journal) {
        if (journal == null)
            return null;

        JournalDto dto = new JournalDto();
        dto.setId(journal.getId());
        dto.setSymbol(journal.getSymbol());
        dto.setType(journal.getType());
        dto.setTradeTime(journal.getTradeTime());
        dto.setPnl(journal.getPnl());
        dto.setSetup(journal.getSetup());
        dto.setConfidence(journal.getConfidence());
        dto.setNotes(journal.getNotes());
        dto.setDate(journal.getDate());

        if (journal.getImages() != null) {
            List<JournalImageDto> imageDtos = journal.getImages().stream().map(img -> {
                JournalImageDto imgDto = new JournalImageDto();
                imgDto.setUrl(img.getUrl());
                imgDto.setDescription(img.getDescription());
                return imgDto;
            }).collect(Collectors.toList());
            dto.setImages(imageDtos);
        }

        return dto;
    }

    public Journal toEntity(JournalDto dto) {
        if (dto == null)
            return null;

        Journal journal = new Journal();
        journal.setId(dto.getId());
        journal.setSymbol(dto.getSymbol());
        journal.setType(dto.getType());
        journal.setTradeTime(dto.getTradeTime());
        journal.setPnl(dto.getPnl());
        journal.setSetup(dto.getSetup());
        journal.setConfidence(dto.getConfidence());
        journal.setNotes(dto.getNotes());
        journal.setDate(dto.getDate());

        if (dto.getImages() != null) {
            List<JournalImage> images = dto.getImages().stream().map(imgDto -> {
                JournalImage img = new JournalImage();
                img.setUrl(imgDto.getUrl());
                img.setDescription(imgDto.getDescription());
                return img;
            }).collect(Collectors.toList());
            journal.setImages(images);
        }

        return journal;
    }
}