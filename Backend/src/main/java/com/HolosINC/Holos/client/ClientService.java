package com.HolosINC.Holos.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;

import com.HolosINC.Holos.auth.Authorities;
import com.HolosINC.Holos.auth.AuthoritiesRepository;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.milestone.Milestone;
import com.HolosINC.Holos.milestone.MilestoneRepository;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public Client updateClient(Long clientId, Client updatedClient) {
		try {
			return clientRepository.findById(clientId).map(client -> {
				client.getBaseUser().setName(updatedClient.getBaseUser().getName());
            	client.getBaseUser().setEmail(updatedClient.getBaseUser().getEmail());
            	client.getBaseUser().setPhoneNumber(updatedClient.getBaseUser().getPhoneNumber());

				Client savedClient = clientRepository.save(client);
				return savedClient;
			}).orElseThrow(() -> {
				return new ResourceNotFoundException("Client", "id", clientId);
			});

		} catch (ResourceNotFoundException e) {
			throw e;
		} catch (DataIntegrityViolationException e) {
			throw new RuntimeException("No se puede actualizar el cliente con ID " + clientId + 
									" debido a restricciones de integridad.");
		} catch (Exception e) {
			throw new RuntimeException("Error interno al actualizar el cliente con ID " + clientId);
		}
	}


	@Transactional
	public void deleteClient(Long clientId) {

		try {

			boolean hasActiveCommissions = clientRepository.hasActiveCommisions(clientId);
			
			if (hasActiveCommissions) {
				throw new IllegalStateException("No se puede eliminar el cliente con ID " + clientId + 
												" porque tiene comisiones activas.");
			}

			Client client = clientRepository.findById(clientId)
					.orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));
			
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
			throw new ResourceNotFoundException("Error: El cliente con ID " + clientId + " no existe.");
		} catch (DataIntegrityViolationException e) {
			throw new RuntimeException("No se puede eliminar el cliente con ID " + clientId + 
									" porque tiene datos relacionados.");
		} catch (Exception e) {
			throw new RuntimeException("Error interno al eliminar el cliente con ID " + clientId);
		}
	}

	@Transactional
    public Client createClient(Client client) {
        try {
            if (baseUserRepository.findUserByUsername(client.getBaseUser().getUsername()).isPresent()) {
                throw new IllegalStateException("El usuario con username " + client.getBaseUser().getUsername() + " ya existe.");
            }

            BaseUser baseUser = new BaseUser();
            baseUser.setName(client.getBaseUser().getName());
            baseUser.setUsername(client.getBaseUser().getUsername());
            baseUser.setEmail(client.getBaseUser().getEmail());
            baseUser.setPassword(client.getBaseUser().getPassword());
            baseUser.setPhoneNumber(client.getBaseUser().getPhoneNumber());
            baseUser.setCreatedUser(new Date());

            Authorities clientRole = authoritiesRepository.findByName("CLIENT")
                    .orElseThrow(() -> new ResourceNotFoundException("Authority", "name", "CLIENT"));
            baseUser.setAuthority(clientRole);

            baseUser = baseUserRepository.save(baseUser);
            
            client.setBaseUser(baseUser);

            Client savedClient = clientRepository.save(client);
            
            return savedClient;

        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error interno al crear el cliente.");
        }
    }
}
