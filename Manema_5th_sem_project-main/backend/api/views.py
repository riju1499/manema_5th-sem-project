from django.shortcuts import render
from .models import CustomUser, Halls, Seat, ShowMovies, UserTicket
from .serializers import CustomUserSerializer, HallSerializer, ShowMoviesSerializer, SeatSerializer, UserTicketSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated 
from django.shortcuts import get_object_or_404

class UserList(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data);
    
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetIfAdmin(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        user = CustomUser.objects.filter(username=username).first()
        if user:
            if user.is_admin:
                return Response({'is_admin': True}, status=status.HTTP_200_OK)
            else:
                return Response({'is_admin': False}, status=status.HTTP_200_OK)
        return Response({"is_admin": False}, status=status.HTTP_200_OK)
    

class HallList(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "You are not an admin"}, status=status.HTTP_403_FORBIDDEN);
    
        halls = Halls.objects.all()
        serializer = HallSerializer(halls, many=True)
        return Response(serializer.data)
    
    def post(self, request):

        if not request.user.is_admin:
            return Response({"detail:", "You are not an admin." }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = HallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
            if not request.user.is_admin:
                return Response({"detail": "You are not an admin."}, status=status.HTTP_403_FORBIDDEN)

            try:
                hall = Halls.objects.get(hall_id=request.data.get('hall_id'))
            except Halls.DoesNotExist:
                return Response({"detail": "Hall not found."}, status=status.HTTP_404_NOT_FOUND)

            hall.delete()
            return Response({"detail": "Hall deleted successfully."}, status=status.HTTP_204_NO_CONTENT)



class ShowMoviesView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_admin:
            return Response({"detail": "You are not an admin."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ShowMoviesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        shows = ShowMovies.objects.all()
        serializer = ShowMoviesSerializer(shows, many=True)
        return  Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request):
        if not request.user.is_admin:
            return Response({"detail": "You are not an admin."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            movies = ShowMovies.objects.filter(movie_id=request.data.get('movie_id')).first()
        except ShowMovies.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        movies.delete()
        return Response({"detail": "Movie deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class UserTicketView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tickets = UserTicket.objects.filter(user_id=user.id)
        serializer = UserTicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserTicketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Booked the ticket"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ShowMovieById(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        movie_id = request.data.get('movie_id')

        if not movie_id:
            return Response(
                {"error": "movie_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        movie = get_object_or_404(ShowMovies, movie_id=movie_id)

        serializer = ShowMoviesSerializer(movie)

        return Response(serializer.data, status=status.HTTP_200_OK)



class BookSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get data from the request
        show_id = request.data.get('show_id')
        seat_numbers = request.data.get('seat_numbers')

        if not show_id or not seat_numbers:
            return Response(
                {"error": "show_id and seat_numbers are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the show object
        show = get_object_or_404(ShowMovies, id=show_id)

        # Validate and book seats
        seats_to_book = Seat.objects.filter(show=show, seat_number__in=seat_numbers)
        if len(seats_to_book) != len(seat_numbers):
            return Response(
                {"error": "Some seat numbers are invalid or do not exist for this show."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for already booked seats
        already_booked = seats_to_book.filter(is_booked=True)
        if already_booked.exists():
            return Response(
                {"error": f"The following seats are already booked: {[seat.seat_number for seat in already_booked]}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark the seats as booked
        seats_to_book.update(is_booked=True)

        # Decrease the available seats count
        show.available_seats -= len(seat_numbers)
        show.save()

        # Create or update a UserTicket for the current user
        user_ticket, created = UserTicket.objects.get_or_create(
            user_id=request.user.id,  # Assuming the authenticated user has an ID
            defaults={"seat_nos": seat_numbers},
        )

        if not created:
            user_ticket.seat_nos.extend(seat_numbers)
            user_ticket.save()

        return Response(
            {
                "message": "Seats booked successfully.",
                "booked_seats": seat_numbers,
                "user_ticket": user_ticket.seat_nos,
            },
            status=status.HTTP_200_OK
        )


class GetHallById(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        hall_id = request.data.get('hall_id')
        
        if not hall_id:
            return Response(
                {"error": "hall_id is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hall = get_object_or_404(Halls, hall_id=hall_id)
        
        response_data = {
            "name": hall.name,
            "location": hall.location,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
