package com.it342.basinillo.service;

import com.it342.basinillo.dto.ClientRequest;
import com.it342.basinillo.entity.Client;
import com.it342.basinillo.entity.Organization;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.ClientRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Client createClient(@NonNull String userEmail, @NonNull ClientRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Organization org = user.getOrganization();
        if (org == null) {
            throw new IllegalStateException("User does not belong to an organization.");
        }

        Client client = Client.builder()
                .organization(org)
                .companyName(request.getCompanyName())
                .tinNumber(request.getTinNumber())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .build();

        return clientRepository.save(client);
    }

    @Transactional(readOnly = true)
    public List<Client> getClientsForOrganization(@NonNull String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Organization org = user.getOrganization();
        if (org == null) return List.of();

        return clientRepository.findByOrganizationId(org.getId());
    }

    @Transactional(readOnly = true)
    public Client getClientById(@NonNull UUID clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found: " + clientId));
    }

    @Transactional
    public Client updateClient(@NonNull UUID clientId, @NonNull ClientRequest request) {
        Client client = getClientById(clientId);

        client.setCompanyName(request.getCompanyName());
        client.setTinNumber(request.getTinNumber());
        client.setContactEmail(request.getContactEmail());
        client.setContactPhone(request.getContactPhone());

        return clientRepository.save(client);
    }

    @Transactional
    public void deleteClient(@NonNull UUID clientId) {
        Client client = getClientById(clientId);
        clientRepository.delete(client);
    }
}
