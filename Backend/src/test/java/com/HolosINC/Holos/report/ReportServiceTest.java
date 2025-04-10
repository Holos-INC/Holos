package com.HolosINC.Holos.report;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.reports.ReportRepository;
import com.HolosINC.Holos.reports.ReportService;
import com.HolosINC.Holos.reports.ReportStatus;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;
import com.HolosINC.Holos.reports.Report;

import com.HolosINC.Holos.reports.ReportDTO;

import com.HolosINC.Holos.reports.ReportType;
import com.HolosINC.Holos.reports.ReportTypeRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private ReportTypeRepository reportTypeRepository;

    @Mock
    private WorkService workService;

    @Mock
    private BaseUserService baseUserService;

    @InjectMocks
    private ReportService reportService;

    @Mock
    private ReportType reportType;

    @Mock
    private Work work;

    @Mock
    private BaseUser baseUser;

    private static final Long REPORT_ID = 12345L;
    private static final Long WORK_ID = 30L;
    private static final Long USER_ID = 10L;

    @BeforeEach
    public void setUp() {
        // Inicializar los mocks
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateReportSuccess() throws Exception {
        // Crear el DTO del reporte
        ReportDTO reportDTO = new ReportDTO("Inappropriate Content", "This artwork violates our policy", WORK_ID,
                "Policy Violation");

        // Crear un Artist mockeado
        Artist artist = mock(Artist.class);
        when(artist.getBaseUser()).thenReturn(baseUser); // Mockear el BaseUser del artista

        // Crear un Work mockeado
        Work work = mock(Work.class);
        when(work.getArtist()).thenReturn(artist); // Mockear el artista asociado al trabajo

        // Mockear el comportamiento de las dependencias
        when(workService.getWorkById(WORK_ID)).thenReturn(work); // El servicio devolverá el trabajo mockeado
        when(reportTypeRepository.findByType("Policy Violation")).thenReturn(Optional.of(reportType)); // El repositorio
                                                                                                       // devuelve el
                                                                                                       // tipo de
                                                                                                       // reporte
        when(baseUserService.findCurrentUser()).thenReturn(baseUser); // El servicio devolverá el usuario base
        when(reportRepository.existsByMadeByIdAndWorkIdAndReportTypeId(USER_ID, WORK_ID, reportType.getId()))
                .thenReturn(false); // Verificar si ya existe un reporte

        // Crear el objeto Report esperado
        Report createdReport = new Report();
        createdReport.setId(REPORT_ID);
        createdReport.setName("Inappropriate Content");
        createdReport.setDescription("This artwork violates our policy");
        createdReport.setStatus(ReportStatus.PENDING);
        createdReport.setMadeBy(baseUser);
        createdReport.setWork(work);
        createdReport.setReportType(reportType);

        // Mockear la respuesta del repositorio
        when(reportRepository.save(any(Report.class))).thenReturn(createdReport);

        // Ejecutar el servicio
        Report result = reportService.createReport(reportDTO);

        // Verificar los resultados
        assertEquals(REPORT_ID, result.getId());
        assertEquals("Inappropriate Content", result.getName());
        assertEquals("This artwork violates our policy", result.getDescription());
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    public void testAcceptReportSuccess() throws Exception {
        // Mockear el reporte y su aceptación
        Report report = new Report();
        report.setId(REPORT_ID);
        report.setStatus(ReportStatus.PENDING); // Asegúrate de que el estado inicial sea PENDING

        // Asegurarse de que el mock de reportRepository devuelva el reporte
        when(reportRepository.findById(REPORT_ID)).thenReturn(Optional.of(report));

        // Mockear el comportamiento del save, para que devuelva el reporte actualizado
        when(reportRepository.save(any(Report.class))).thenReturn(report); // Asegurarse de que se guarde correctamente

        // Ejecutar el servicio
        Report result = reportService.acceptReport(REPORT_ID);

        // Verificar que el reporte haya sido aceptado (cambiar el estado a ACCEPTED)
        assertNotNull(result); // Asegurarse de que el resultado no sea null
        assertEquals(ReportStatus.ACCEPTED, result.getStatus());

        // Verificar que el reporte se haya guardado correctamente
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    public void testAcceptReportInvalidStatus() {
        // Mockear el reporte con estado no PENDING
        Report report = new Report();
        report.setId(REPORT_ID);
        report.setStatus(ReportStatus.ACCEPTED);

        when(reportRepository.findById(REPORT_ID)).thenReturn(Optional.of(report));

        // Ejecutar el servicio y esperar una excepción de tipo RuntimeException
        assertThrows(RuntimeException.class, () -> reportService.acceptReport(REPORT_ID));

        // Verificar que no se haya guardado el reporte
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    public void testRejectReportSuccess() throws Exception {
        // Crear el reporte con estado PENDING
        Report report = new Report();
        report.setId(REPORT_ID);
        report.setStatus(ReportStatus.PENDING);

        // Mockear el comportamiento del repositorio
        when(reportRepository.findById(REPORT_ID)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenReturn(report); // Mockear la respuesta de save()

        // Ejecutar el servicio
        Report result = reportService.rejectReport(REPORT_ID);

        // Verificar que el reporte haya sido rechazado
        assertEquals(ReportStatus.REJECTED, result.getStatus());

        // Verificar que el reporte se haya guardado una vez
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    public void testDeleteReportSuccess() throws Exception {
        // Mockear el reporte con estado REJECTED
        Report report = new Report();
        report.setId(REPORT_ID);
        report.setStatus(ReportStatus.REJECTED);

        when(reportRepository.findById(REPORT_ID)).thenReturn(Optional.of(report));

        // Ejecutar el servicio
        reportService.deleteReport(REPORT_ID);

        // Verificar que el reporte haya sido eliminado
        verify(reportRepository, times(1)).delete(report);
    }

    @Test
    public void testDeleteReportInvalidStatus() {
        // Mockear el reporte con estado no REJECTED
        Report report = new Report();
        report.setId(REPORT_ID);
        report.setStatus(ReportStatus.PENDING);

        when(reportRepository.findById(REPORT_ID)).thenReturn(Optional.of(report));

        // Ejecutar el servicio y esperar una excepción
        assertThrows(IllegalStateException.class, () -> reportService.deleteReport(REPORT_ID));

        // Verificar que no se haya eliminado el reporte
        verify(reportRepository, never()).delete(any(Report.class));
    }

    @Test
    public void testGetReportTypeByTypeNotFound() {
        // Ejecutar el servicio con un tipo no existente
        when(reportTypeRepository.findByType("NonExistingType")).thenReturn(Optional.empty());

        // Ejecutar el servicio y esperar una excepción
        assertThrows(ResourceNotFoundException.class, () -> reportService.getReportTypeByType("NonExistingType"));
    }
}
