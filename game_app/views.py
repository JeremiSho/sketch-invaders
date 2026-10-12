import time
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.http import require_POST
from .forms import SimpleLoginForm, SimpleRegistrationForm
from .models import Score, Level


@login_required(login_url='login')
def menu_view(request):
    levels = Level.objects.all().order_by('number')
    user_scores = Score.objects.filter(
        user=request.user).select_related('level')

    score_dict = {
        score.level.number: score.best_score for score in user_scores}
    for level in levels:
        level.best_score = score_dict.get(level.id, 0)

    return render(request, 'menu.html', {'levels': levels})


@login_required(login_url='login')
def game_view(request, level):
    obj = get_object_or_404(Level, number=level)
    return render(request, 'game.html', {'level': obj})


@login_required
@require_POST
def save_score_api(request):
    try:
        data = json.loads(request.body)
        level_number = data.get('level')
        score = data.get('score')

        try:
            level = Level.objects.get(number=level_number)
        except Level.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'The level does not exist.'}, status=404)

        # get_or_create finds the existing record, or creates it if it's the first time playing
        obj, created = Score.objects.get_or_create(
            user=request.user,
            level=level,
            defaults={'best_score': score}
        )

        # If it already existed, check if the new score is better and update
        if not created and score > obj.best_score:
            obj.best_score = score
            obj.save()

        return JsonResponse({'status': 'success', 'best_score': obj.best_score})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


def live_scores_stream(request, level):
    def event_stream():
        # Infinite loop that keeps the connection alive
        while True:
            # Get Top 5 scores for this specific level
            top_scores = Score.objects.filter(
                level=level).order_by('-best_score')[:5]

            # Format data into a list of dictionaries
            data = [
                {'username': score.user.username, 'score': score.best_score}
                for score in top_scores
            ]

            # Yield data in the strict SSE format: "data: <json_string>\n\n"
            yield f"data: {json.dumps(data)}\n\n"

            # Pause for 2 seconds before querying the database again
            # This prevents overloading the server with requests
            time.sleep(2)

    # Return the stream with the correct content type for SSE
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')


def register_view(request):
    if request.user.is_authenticated:
        return redirect('menu')

    if request.method == 'POST':
        form = SimpleRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('menu')
    else:
        form = SimpleRegistrationForm()

    return render(request, 'register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('menu')

    if request.method == 'POST':
        form = SimpleLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('menu')
    else:
        form = SimpleLoginForm()

    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('login')
