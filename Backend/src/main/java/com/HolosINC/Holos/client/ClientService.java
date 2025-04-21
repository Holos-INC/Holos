package com.HolosINC.Holos.client;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserRepository;
import com.HolosINC.Holos.reports.Report;
import com.HolosINC.Holos.reports.ReportRepository;

@Service
public class ClientService {

	private final ClientRepository clientRepository;
	private BaseUserRepository baseUserRepository;
	private ReportRepository reportRepository;
	private CommisionRepository commisionRepository;

	public ClientService(ClientRepository clientRepository, BaseUserRepository baseUserRepository, ReportRepository reportRepository, CommisionRepository commisionRepository) {
		this.clientRepository = clientRepository;
		this.reportRepository = reportRepository;
		this.commisionRepository = commisionRepository;
		this.baseUserRepository = baseUserRepository;
	}


	@Transactional
	public Client saveClient(Client client) throws DataAccessException {
		clientRepository.save(client);
		return client;
	}


	@Transactional(readOnly = true)
	public Client findClient(Long clientId) {
		return clientRepository.findById(clientId)
				.orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));
	}

	@Transactional(readOnly = true)
	public Client findClientByUserId(Long userId) {
		return clientRepository.findClientByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Client", "userId", userId));
	}

	@Transactional(readOnly = true)
	public boolean isClient(Long userId) {
		return !(clientRepository.findClientByUserId(userId).isEmpty());
	}

	@Transactional(readOnly = true)
	public Iterable<Client> findAll() {
		return clientRepository.findAll();
	}

	@Transactional
	public void deleteClient(Long userId) throws Exception{
		try {
			Client client = clientRepository.findClientByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Client", "userId", userId));
			Long clientId = client.getId(); 
			boolean hasActiveCommissions = clientRepository.hasActiveCommisions(clientId);
			if (hasActiveCommissions) {
				throw new AccessDeniedException("No se puede eliminar el cliente " + client.getBaseUser().getUsername()+ 
												" porque tiene comisiones activas.");
			}
			List<Commision> commissions = commisionRepository.findAllByClientId(clientId);
			commisionRepository.deleteAll(commissions);
	
			List<Report> reportsReceived = reportRepository.findAllByReportedUserId(clientId);
			reportRepository.deleteAll(reportsReceived);

			List<Report> reportsMade = reportRepository.findAllByMadeById(clientId);
			reportRepository.deleteAll(reportsMade);
	
			if (client.getBaseUser() != null) {
				baseUserRepository.deleteById(client.getBaseUser().getId());
			}
	
			clientRepository.delete(client);

		} catch (IllegalStateException e) {
			throw e;
		} catch (ResourceNotFoundException e) {
			throw new ResourceNotFoundException("Error: El cliente con ID " + userId + " no existe.");
		} catch (DataIntegrityViolationException e) {
			throw new RuntimeException("No se puede eliminar el cliente con ID " + userId + 
									" porque tiene datos relacionados.");
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		} 
	}
}
