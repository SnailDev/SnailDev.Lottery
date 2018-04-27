from flask import Flask, request
app = Flask(__name__)


@app.route('/')
def api_root():
    return 'BI Ver1.0<br />请求路径：/api/{业务名称}/{方法名}'


@app.route('/api/lottery/forecast')
def api_forecast():
    if 'type' in request.args:
        types = request.args['type']
        if types == 'bjpk10':
            return '方案待定中...'
        elif types == 'cqssc':
            import pymongo
            import numpy as np
            import pandas as pd

            client = pymongo.MongoClient('localhost', 27017)
            db = client['Lottery']
            col = db['CQSSC']
            lists = list(col.find().sort('_id', pymongo.DESCENDING).limit(80))
            data = pd.DataFrame(lists[0:30][::-1])
            # data = pd.DataFrame(lists[0:50][::-1])
            # data = pd.DataFrame(lists[0:80][::-1])
            result = ''

            # result += '0x00.各项中数字出现频次统计结果如下：<br />'
            # columNames = ['万位', '千位', '百位', '十位', '个位']
            # for i in range(5):

            #     tongJi30 = sorted(
            #         dict(
            #             zip(*np.unique(
            #                 data['num' + str(i + 1)], return_counts=True)))
            #         .items(),
            #         key=lambda e: e[1],
            #         reverse=True)
            #     if len(tongJi30) == 10:
            #         del tongJi30[9]
                
            #     result += columNames[i] + '统计结果：' + str(tongJi30) + '<br />'


            return result

    else:
        return '参数type是必要的.'


if __name__ == '__main__':
    app.run(port=3001)
