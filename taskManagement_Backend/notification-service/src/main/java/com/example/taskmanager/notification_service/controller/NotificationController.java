package com.example.taskmanager.notification_service.controller;

import com.example.taskmanager.notification_service.dto.NotificationRequest;
import com.example.taskmanager.notification_service.model.Notification;
import com.example.taskmanager.notification_service.model.NotificationPreference;
import com.example.taskmanager.notification_service.dto.NotificationPreferenceRequest;
import com.example.taskmanager.notification_service.service.NotificationService;
import com.example.taskmanager.notification_service.service.PreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PreferenceService preferenceService;

    @GetMapping({"", "/"})
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }

    @PostMapping("/create")
    public Notification createNotification(@RequestBody NotificationRequest request) {
        return notificationService.createNotification(new Notification(request.getMessage()));
    }

    @PatchMapping("/mark-read/{id}")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Notification deleted with id: " + id;
    }


    //  Get current user's notification preferences
    @GetMapping("/preferences")
    public List<NotificationPreference> getPreferences(HttpServletRequest request) {
        Long userId = resolveCurrentUserId(request);
        return preferenceService.getByUserId(userId);
    }

    //  Update current user's notification preferences
    @PutMapping("/preferences")
    public void updatePreferences(@RequestBody List<NotificationPreferenceRequest> prefs, HttpServletRequest request) {
        Long userId = resolveCurrentUserId(request);
        preferenceService.save(userId, prefs);
    }

    private Long resolveCurrentUserId(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof Long userId) {
                return userId;
            }
            if (principal instanceof Integer userId) {
                return userId.longValue();
            }
            if (principal instanceof String value) {
                try {
                    return Long.parseLong(value);
                } catch (NumberFormatException ignored) {
                }
            }
        }

        String headerUserId = request.getHeader("X-User-Id");
        if (headerUserId != null && !headerUserId.isBlank()) {
            try {
                return Long.parseLong(headerUserId);
            } catch (NumberFormatException ignored) {
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

}
