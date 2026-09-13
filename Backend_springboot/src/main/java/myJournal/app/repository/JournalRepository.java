package myJournal.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import myJournal.app.entity.Journal;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    @Query("SELECT j.id, j.symbol, j.type, j.tradeTime, j.pnl, j.setup, j.confidence, j.date FROM Journal j")
    List<Object[]> findAllLightweight();
}