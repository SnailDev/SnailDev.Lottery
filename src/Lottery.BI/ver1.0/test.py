import pymongo
import numpy as np
import pandas as pd

client = pymongo.MongoClient('localhost', 27017)
db = client['Lottery']
col = db['CQSSC']
lists = list(col.find().sort('_id', pymongo.DESCENDING).limit(80))

for i in range(6):
    data = pd.DataFrame(lists[i*5:(i+1)*5][::-1])
    columNames = ['万位', '千位', '百位', '十位', '个位']
    for i in range(5):
        tongJi30 = sorted(
            dict(
                zip(*np.unique(
                    data['num' + str(i + 1)], return_counts=True)))
            .items(),
            key=lambda e: e[1],
            reverse=True)
        
        print(columNames[i] + '统计结果：' + str(tongJi30))

    print('----------------------------------------------')

# data = pd.DataFrame(lists[0:50][::-1])
# data = pd.DataFrame(lists[0:80][::-1])

# data = np.array(lists[0:30][::-1])
#print(data[0])

#print(data['num1'])

# tongji_count = (dict(key, data['num1'].count(key)) for key in range(10))
# print(tongji_count)


# def tongji_count(datalist):
#     _dict_item = {}
#     for j in range(10):
#         _dict_item.setdefault(j, datalist.count(j))

#     return _dict_item


# def tongji_sqan(datalist):
#     _dict_item = {}
#     for j in range(10):
#         sqan = []
#         if j in datalist:
#             indexes = datalist.index(7)
#             print(indexes)
#         else:
#             _dict_item.setdefault(j,len(datalist))

#         _dict_item.setdefault(j, datalist.count(j))

#     return _dict_item


# _list = []
# for i in range(5):
#     indexName = 'num' + str(i + 1)
#     numlist = list(data[indexName])
#     tongji_sqan(numlist)
# #     _dict_item = {}
# #     _dict_item.setdefault('count', tongji_count(numlist))

# #     _list.append(_dict_item)

# # print(_list)
