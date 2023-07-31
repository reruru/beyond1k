import requests
from flask import Flask, jsonify, redirect, request, render_template, send_file, make_response
from flask_cors import cross_origin, CORS
from user_agents import parse
import json
import ssl
import pickle
import logging
import os
import sys
import random
from io import BytesIO
from datetime import date, datetime
from tqdm import tqdm

import json
from collections import OrderedDict


id2article_info = {}
wak_id2article_info = {}
gomem_id2article_info = {}

last_timestamp = datetime.now()

def read_pickle():
    global id2article_info, wak_id2article_info, gomem_id2article_info 
    try:
        with open('id2article_info.pkl', 'rb') as f:
            id2article_info = pickle.load(f)
        print('loaded id2article_info', flush=True)
        with open('wak_id2article_info.pkl', 'rb') as f:
            wak_id2article_info = pickle.load(f)
        print('loaded wak_id2article_info', flush=True)
        with open('gomem_id2article_info.pkl', 'rb') as f:
            gomem_id2article_info = pickle.load(f)
        print('loaded gomem_id2article_info', flush=True)
    except:
        pass
    
#now_ts = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
#logging.basicConfig(stream=sys.stdout, filename="logs/"+now_ts+".log", level=logging.DEBUG)
root = logging.getLogger()
root.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)

app = Flask(__name__)
CORS(app, resources={r'/*':{'origins':['https://test-refind.reruru.com', 'https://re-find.xyz', 'https://www.re-find.xyz', 'https://re-find-git-develop-chokoty.vercel.app']}})
#CORS(app, resources={r'/receive/':{'origins':'https://test-refind.reruru.com'}})
#CORS(app, resources={r'/front/':{'origins':'https://test1-refind.reruru.com'}})
#CORS(app, resources={r'/counter/':{'origins':'https://test1-refind.reruru.com'}})
#CORS(app, resources={r'/today_counter/':{'origins':'https://test1-refind.reruru.com'}})
#CORS(app, resources={r'/last_update_info/':{'origins':'https://test1-refind.reruru.com'}})

@app.route('/')
def front(): 
    resp = make_response(render_template('index.html'))
    return resp


@app.route('/view', methods=['POST'])
#@cross_origin()
def view():
    data = json.loads(request.data)
    article_info_list = dict()
    if data['board_checklist']['isd']:
        article_info_list = {**article_info_list, **id2article_info}
    if data['board_checklist']['wak']:
        article_info_list = {**article_info_list, **wak_id2article_info}
    if data['board_checklist']['gomem']:
        article_info_list = {**article_info_list, **gomem_id2article_info}
    
    article_info_list = article_info_list.items()
    article_info_list = [(int(x), y) for x, y in article_info_list]
    article_info_list = sorted(article_info_list)[::-1]
    page = int(data['page'])
    #page_start = int(data['page']) // 10 * 10
    ipp = int(data['num_items'])

    print('len:', len(article_info_list))
    return jsonify({'items': article_info_list[(page - 1) * ipp : page * ipp], 'len': (len(article_info_list) - 1) // ipp + 1})





if __name__ == '__main__':
    read_pickle()

    #ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    #ssl_context.load_cert_chain(certfile='/home/ubuntu/.ssh/server.crt', keyfile='/home/ubuntu/.ssh/server.key', password='segusegu_hangang')
    app.secret_key = 'plz gen sec key'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024
    #app.run(host='146.56.167.61', port=54321, debug=False, use_reloader=True)
    app.run(host='0.0.0.0', port=65432, debug=False, use_reloader=True)
    #app.run(host='0.0.0.0', port=54321, debug=False, use_reloader=True, ssl_context=ssl_context)
