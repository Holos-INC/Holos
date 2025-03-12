package com.HolosINC.Holos.Kanban;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class StatusKanbanOrderService {


    private StatusKanbanOrderRepository statusKanbanOrderRepository;
    private ArtistService artistService;
    private BaseUserService baseUserService;


    @Autowired
    public StatusKanbanOrderService(StatusKanbanOrderRepository statusKanbanOrderRepository, ArtistService artistService
        , BaseUserService baseUserService) {
        this.statusKanbanOrderRepository = statusKanbanOrderRepository;
        this.artistService = artistService;
        this.baseUserService = baseUserService;
    }

    @Transactional
    public StatusKanbanOrder createStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    //Se pone el orden el último. Si no hay nada, el primero por dewfecto

    @Transactional
    public StatusKanbanOrder addStatusToKanban(String color, String description, String nombre, Long artistId) {
        Artist artist = artistService.findArtist(artistId);
        if (artist == null) {
            throw new ResourceNotFoundException("Artist","id", artistId);
        }
        BaseUser authenticatedUser = baseUserService.findCurrentUser();
        Artist authenticatedArtist = artistService.findArtist(authenticatedUser.getId());

        if(artistId != authenticatedArtist.getId() ) {
            throw new IllegalArgumentException("El artista no tiene permisos.");
        }
        StatusKanbanOrder statusKanbanOrder = new StatusKanbanOrder();
        statusKanbanOrder.setColor(color);
        statusKanbanOrder.setDescription(description);
        statusKanbanOrder.setName(nombre);
        List<StatusKanbanOrder> list = statusKanbanOrderRepository.findByArtist(artistId);
        if(list.isEmpty()){
            statusKanbanOrder.setOrder(1);  
        }else{
            statusKanbanOrder.setOrder(list.size()+1);
        }
        statusKanbanOrder.setArtist(artistService.findArtist(artistId.longValue()));
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }
    
    @Transactional
    public StatusKanbanOrder updateStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional
    public StatusKanbanOrder updateKanban(int id, String color, String description, String nombre) {
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        sk.setColor(color);
        sk.setDescription(description);
        sk.setName(nombre);
        return statusKanbanOrderRepository.save(sk);
    }

    @Transactional
    public StatusKanbanOrder updateOrder(int id, Integer order) {
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        if(sk.getOrder()==order){
            return statusKanbanOrderRepository.save(sk);
        }else{
            List<StatusKanbanOrder> list = statusKanbanOrderRepository.findByArtist(sk.getArtist().getId());
            //Recorro los statuskanban order de cada artista para recolocarlos
            for (StatusKanbanOrder sk2 : list) {
                    if(sk.getOrder()>order){
                        //Si el orden es mayor que el nuevo orden, tengo que bajar el resto sumándoles 1, hasta que lleguen a la posición del orden antiguo
                        if(sk2.getOrder()>=order && sk2.getOrder()<sk.getOrder()){
                            sk2.setOrder(sk2.getOrder()+1);
                            statusKanbanOrderRepository.save(sk2);
                        }
                    }else{
                        //Si el orden es menor que el nuevo orden, tengo que subir el resto restándoles 1, hasta que lleguen a la posición del orden antiguo
                        //No pueden ser iguales porque fuera he descartado ese caso
                        if(sk2.getOrder()<=order && sk2.getOrder()>sk.getOrder()){
                            sk2.setOrder(sk2.getOrder()-1);
                            statusKanbanOrderRepository.save(sk2);
                        }
                    }
                    
                }
                sk.setOrder(order);
        }return statusKanbanOrderRepository.save(sk);
    }

    @Transactional(readOnly = true)
	public StatusKanbanOrder findStatusKanbanOrder(Integer statusKanbanOrderId) {
		return statusKanbanOrderRepository.findById(statusKanbanOrderId)
				.orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", statusKanbanOrderId));
	}

    @Transactional(readOnly = true)
	public List<StatusKanbanOrder> findAllStatusKanbanOrder() {
		return statusKanbanOrderRepository.findAll();
	}

    @Transactional(readOnly = true)
	public List<StatusKanbanOrder> findAllStatusKanbanOrderByArtist(Long artistId) {
        Artist artist = artistService.findArtist(artistId);
        if (artist == null) {
            throw new ResourceNotFoundException("Artist","id", artistId);
        }
        BaseUser authenticatedUser = baseUserService.findCurrentUser();
        Artist authenticatedArtist = artistService.findArtist(authenticatedUser.getId());

        if(artistId != authenticatedArtist.getId() ) {
            throw new IllegalArgumentException("El artista no tiene permisos.");
        }
		return statusKanbanOrderRepository.findByArtist(artistId);
	}

    @Transactional
    public void deleteStatusKanbanOrder(Integer id) {
        StatusKanbanOrder statusToDelete = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));

        Long artistId = statusToDelete.getArtist().getId();
        Integer orderDeleted = statusToDelete.getOrder();

        statusKanbanOrderRepository.deleteById(id);

        List<StatusKanbanOrder> statusList = statusKanbanOrderRepository.findByArtist(artistId);

        for (StatusKanbanOrder status : statusList) {
            if (status.getOrder() > orderDeleted) {
                status.setOrder(status.getOrder() - 1);
                statusKanbanOrderRepository.save(status);
            }
        }
    }

    @Transactional
    public StatusKanbanOrder updateOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }
}
