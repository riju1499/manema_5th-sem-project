from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)


class Halls(models.Model):
    hall_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=500)


class ShowMovies(models.Model):
    movie_id = models.IntegerField()
    show_date_and_time = models.DateTimeField(auto_now_add=False)
    hall = models.ForeignKey('Halls', on_delete=models.CASCADE)
    available_seats = models.IntegerField(default=80)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.seats.exists():
            self.create_seats()

    def create_seats(self):
        rows = 8 
        columns = 10  
        
        for row in range(rows):
            row_letter = chr(ord('A') + row)  
            for col in range(1, columns + 1):
                seat_number = f"{row_letter}{col}"
                Seat.objects.create(show=self, seat_number=seat_number)

class Seat(models.Model):
    show = models.ForeignKey(ShowMovies, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)


class UserTicket(models.Model):
    seat_nos = models.JSONField(default=list)
    booked_at = models.DateTimeField(auto_now_add=True)
    user_id = models.IntegerField()
