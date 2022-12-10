from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ShoppingMasterOL.utils.util import *
from ShoppingMasterOL.utils.algorithm import *
import json

def index(request):
    return render(request, 'index.html')

def service(request):
    return render(request, 'service.html')

def get_user_image(request):
    image = open('ShoppingMasterOL/public/imgs/user.png', 'rb').read()
    return HttpResponse(image, content_type='image/png')

def get_image(request, id):
    img_name = str(id) + ".jpg"
    image = open('ShoppingMasterOL/public/plugins/goods/' + img_name, 'rb').read()
    return HttpResponse(image, content_type='image/jpg')

def get_detail(request):
    return FileResponse(open('ShoppingMasterOL/public/plugins/goods/goods_detail.json', 'rb'))

def analysis_matrix(request):
    json_data = json.loads(request.POST.get('json'))
    matrix = matrixlize(json_data)
    dict_data = recommend_algorithm(matrix)
    json_format = jsonlize(dict_data)
    print(json_format)
    return render(request, 'recommend.html', json_format)

@csrf_exempt
def response_message(request):
    reply = service_reply((json.loads(request.body)).get('message'))
    return JsonResponse({'reply': reply})