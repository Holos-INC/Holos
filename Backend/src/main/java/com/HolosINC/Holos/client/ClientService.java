package com.HolosINC.Holos.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class ClientService {

	private final ClientRepository clientRepository;

	@Autowired
	public ClientService(ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	@Transactional
	public Client saveClient(Client client) throws DataAccessException {
		clientRepository.save(client);
		return client;
	}


	@Transactional(readOnly = true)
	public Client findClient(Long clientId) {
		return clientRepository.getClientByUser(clientId)
				.orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));
	}

	@Transactional(readOnly = true)
	public Iterable<Client> findAll() {
		return clientRepository.findAll();
	}
}
