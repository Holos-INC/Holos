package com.HolosINC.Holos.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.auth.AuthoritiesRepository;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.milestone.Milestone;
import com.HolosINC.Holos.milestone.MilestoneRepository;
import com.HolosINC.Holos.model.BaseUserRepository;

@Service
public class ClientService {

	private final ClientRepository clientRepository;
	private BaseUserRepository baseUserRepository;
	private CommisionRepository commisionRepository;
	private MilestoneRepository milestoneRepository;
	private AuthoritiesRepository authoritiesRepository;

	@Autowired
	public ClientService(ClientRepository clientRepository, BaseUserRepository baseUserRepository, CommisionRepository commisionRepository, MilestoneRepository milestoneRepository, AuthoritiesRepository authoritiesRepository) {
		this.clientRepository = clientRepository;
		this.baseUserRepository = baseUserRepository;
		this.commisionRepository = commisionRepository;
		this.milestoneRepository = milestoneRepository;
		this.authoritiesRepository = authoritiesRepository;
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
		return clientRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Client", "userId", userId));
	}

	@Transactional(readOnly = true)
	public Iterable<Client> findAll() {
		return clientRepository.findAll();
	}

	@Transactional
	public void deleteClient(Long userId) {

		try {
			Client client = clientRepository.findById(userId)
			.orElseThrow(() -> new ResourceNotFoundException("Client", "id", userId));
			Long clientId = client.id;
			boolean hasActiveCommissions = clientRepository.hasActiveCommisions(clientId);
			
			if (hasActiveCommissions) {
				throw new IllegalStateException("No se puede eliminar el cliente con ID " + clientId + 
												" porque tiene comisiones activas.");
			}
			
					List<Commision> commisions = commisionRepository.findAllByClientId(clientId);
			
			for (Commision commision : commisions) {
				List<Milestone> milestones = milestoneRepository.findAllByCommisionId(commision.getId());
				milestoneRepository.deleteAll(milestones);
			}
			
			commisionRepository.deleteAll(commisions);
			
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
			throw new RuntimeException("Error interno al eliminar el cliente con ID " + userId);
		}
	}
}
