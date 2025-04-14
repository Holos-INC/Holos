package com.HolosINC.Holos.report;

import com.HolosINC.Holos.reports.Report;
import com.HolosINC.Holos.reports.ReportController;
import com.HolosINC.Holos.reports.ReportDTO;
import com.HolosINC.Holos.reports.ReportService;
import com.HolosINC.Holos.reports.ReportType;
import com.HolosINC.Holos.work.Work;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class ReportControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReportService reportService;

    @InjectMocks
    private ReportController reportController;

    private ObjectMapper objectMapper;

    private static final Long REPORT_ID = 12345L;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reportController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testCreateReportSuccess() throws Exception {
        // Creación de un Work y ReportType mockeados
        Work work = mock(Work.class);
        ReportType reportType = mock(ReportType.class);

        // Crear el DTO utilizando el constructor proporcionado
        ReportDTO reportDTO = new ReportDTO("Inappropriate Content", 
                                            "This artwork violates our policy", 
                                            30L, // workId
                                            "Policy Violation");

        // Simulando la creación del Report en el servicio
        Report createdReport = reportDTO.createReport(work, reportType);
        createdReport.setId(REPORT_ID);

        // Configuramos el comportamiento del servicio para devolver el reporte creado
        when(reportService.createReport(any(ReportDTO.class))).thenReturn(createdReport);

        mockMvc.perform(post("/api/v1/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reportDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(REPORT_ID))
                .andExpect(jsonPath("$.name").value("Inappropriate Content"))
                .andExpect(jsonPath("$.description").value("This artwork violates our policy"))
                .andDo(result -> {
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });

        // Verificamos que el servicio haya sido llamado correctamente
        verify(reportService, times(1)).createReport(any(ReportDTO.class));
    }

    @Test
    public void testCreateReportBadRequest() throws Exception {
        // Crear el DTO con datos que generarán un error
        ReportDTO reportDTO = new ReportDTO("Spam", 
                                            "Repeated content", 
                                            30L, // workId
                                            "Spam Content");

        // Simulamos que el servicio lanza una excepción de tipo IllegalArgumentException
        when(reportService.createReport(any(ReportDTO.class)))
                .thenThrow(new IllegalArgumentException("Datos inválidos"));

        mockMvc.perform(post("/api/v1/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reportDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Datos inválidos"));

        // Verificamos que el servicio fue llamado
        verify(reportService, times(1)).createReport(any(ReportDTO.class));
    }

    @Test
    public void testGetAllReportsSuccess() throws Exception {
        // Crear lista de reports mockeada
        Report report1 = mock(Report.class);
        report1.setId(REPORT_ID);
        report1.setName("Report 1");

        Report report2 = mock(Report.class);
        report2.setId(REPORT_ID + 1);
        report2.setName("Report 2");

        // Simular comportamiento del servicio
        when(reportService.getReports()).thenReturn(List.of(report1, report2));

        mockMvc.perform(get("/api/v1/reports/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andDo(result -> {
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });

        verify(reportService, times(1)).getReports();
    }

    @Test
    public void testAcceptReportSuccess() throws Exception {
    // Crear un report real con la ID y otros datos mockeados
    Report acceptedReport = new Report();
    acceptedReport.setId(REPORT_ID);
    acceptedReport.setName("Inappropriate Content");
    acceptedReport.setDescription("This artwork violates our policy");

    // Simulamos que el servicio acepta el reporte
    when(reportService.acceptReport(REPORT_ID)).thenReturn(acceptedReport);

    mockMvc.perform(put("/api/v1/reports/admin/accept/{id}", REPORT_ID))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(REPORT_ID)) // Aseguramos que el ID esté presente en la respuesta
            .andExpect(jsonPath("$.name").value("Inappropriate Content")) // Verificamos que el nombre esté correctamente presente
            .andExpect(jsonPath("$.description").value("This artwork violates our policy")); // Verificamos que la descripción esté presente

    verify(reportService, times(1)).acceptReport(REPORT_ID);
}

@Test
public void testRejectReportSuccess() throws Exception {
    // Crear un report real con la ID y otros datos mockeados
    Report rejectedReport = new Report();
    rejectedReport.setId(REPORT_ID);
    rejectedReport.setName("Spam Content");
    rejectedReport.setDescription("Repeated content violation");

    // Simulamos que el servicio rechaza el reporte
    when(reportService.rejectReport(REPORT_ID)).thenReturn(rejectedReport);

    mockMvc.perform(put("/api/v1/reports/admin/reject/{id}", REPORT_ID))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(REPORT_ID)) // Aseguramos que el ID esté presente en la respuesta
            .andExpect(jsonPath("$.name").value("Spam Content")) // Verificamos que el nombre esté correctamente presente
            .andExpect(jsonPath("$.description").value("Repeated content violation")); // Verificamos que la descripción esté presente

    verify(reportService, times(1)).rejectReport(REPORT_ID);
}
    @Test
    public void testDeleteReportSuccess() throws Exception {
        // Simulamos que el servicio elimina el reporte
        doNothing().when(reportService).deleteReport(REPORT_ID);

        mockMvc.perform(delete("/api/v1/reports/admin/delete/{id}", REPORT_ID))
                .andExpect(status().isOk())
                .andExpect(content().string("Reporte eliminado correctamente."));

        verify(reportService, times(1)).deleteReport(REPORT_ID);
    }

    @Test
    public void testGetReportTypesSuccess() throws Exception {
        // Crear lista de tipos de reportes mockeados
        ReportType reportType1 = mock(ReportType.class);
        ReportType reportType2 = mock(ReportType.class);

        when(reportService.getReportTypes()).thenReturn(List.of(reportType1, reportType2));

        mockMvc.perform(get("/api/v1/reports/types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(reportService, times(1)).getReportTypes();
    }
}
