"""Cliente arXiv: consulta pública HTTPS e saída JSON; somente stdlib."""
import argparse
import json
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

def search(query, limit=10, start=0):
    if not query or not 1 <= limit <= 100 or start < 0:
        raise ValueError('Invalid query, limit or start')
    url='https://export.arxiv.org/api/query?'+urlencode({'search_query':query,'start':start,'max_results':limit})
    request=Request(url,headers={'User-Agent':'SquadOS-Studio-Darwin/1.0'})
    with urlopen(request,timeout=30) as response: data=response.read(8*1024*1024+1)
    if len(data)>8*1024*1024:raise ValueError('Response too large')
    root=ET.fromstring(data);ns={'a':'http://www.w3.org/2005/Atom'}
    results=[]
    for item in root.findall('a:entry',ns):
        text=lambda key:' '.join((item.findtext('a:'+key,default='',namespaces=ns)).split())
        if text('id').endswith('/api/errors'):raise ValueError(text('summary'))
        results.append({'id':text('id'),'title':text('title'),'summary':text('summary'),'published':text('published'),'updated':text('updated'),'authors':[a.findtext('a:name',default='',namespaces=ns) for a in item.findall('a:author',ns)],'links':[v.attrib for v in item.findall('a:link',ns)]})
    return results

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--query',required=True);parser.add_argument('--limit',type=int,default=10);parser.add_argument('--start',type=int,default=0);args=parser.parse_args()
    sys.stdout.reconfigure(encoding='utf-8')
    print(json.dumps(search(args.query,args.limit,args.start),ensure_ascii=False,indent=2))
