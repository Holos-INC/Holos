package com.HolosINC.Holos.reports;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.exceptions.InvalidReportTypeException;

@Service
public class ReportTypeService {

    @Autowired
    private ReportTypeRepository reportTypeRepository;

    @Autowired
    private ReportService reportService;

    public ReportType createReportType(String typeName) {
        if (typeName == null || typeName.trim().isEmpty()) {
            throw new InvalidReportTypeException("El nombre del tipo de reporte no puede estar vacío.");
        }

        boolean exists = reportTypeRepository.findAllByType(typeName).isEmpty();
        if (exists) {
            throw new InvalidReportTypeException("El tipo de reporte ya existe.");
        }

        ReportType reportType = new ReportType();
        reportType.setType(typeName.trim());
        return reportTypeRepository.save(reportType);
    }

    public List<ReportType> getAllReportTypes() {
        return reportTypeRepository.findAll();
    }

    public ReportType updateReportType(Long id, String newTypeName) {
        ReportType reportType = reportTypeRepository.findById(id)
            .orElseThrow(() -> new InvalidReportTypeException("Tipo de reporte no encontrado con ID: " + id));

        if (newTypeName == null || newTypeName.trim().isEmpty()) {
            throw new InvalidReportTypeException("El nuevo nombre no puede estar vacío.");
        }

        List<ReportType> existingTypes = reportTypeRepository.findAllByType(newTypeName);
        for (ReportType existing : existingTypes) {
            if (!existing.getId().equals(id)) {
                throw new InvalidReportTypeException("Ya existe un tipo de reporte con ese nombre.");
            }
        }

        reportType.setType(newTypeName.trim());
        return reportTypeRepository.save(reportType);
    }

    public void deleteReportType(Long id) {
        ReportType reportType = reportTypeRepository.findById(id)
            .orElseThrow(() -> new InvalidReportTypeException("Tipo de reporte no encontrado con ID: " + id));
    
        if (reportService.hasPendingReportsForType(reportType)) {
            throw new InvalidReportTypeException("No se puede eliminar el tipo de reporte mientras tenga reportes en estado PENDING.");
        }
    
        reportService.unlinkReportTypeFromReports(reportType); 
    
        reportTypeRepository.delete(reportType);
    }
}
