import pymongo
import numpy as np
import pandas as pd

client = pymongo.MongoClient('localhost', 29018)
db = client['Lottery']
col = db['CQSSC']
lists = list(col.find({
    '_id': {
        '$gt': '20180427000'
    }
}))  #.sort('_id', pymongo.DESCENDING).limit(80))

for j in range(len(lists) / 5):
    data = pd.DataFrame(lists[j * 5:(j + 1) * 5][::-1])
    # print data
    # columNames = ['万位', '千位', '百位', '十位', '个位']
    tongji = []
    for i in range(5):
        tongJi30 = sorted(
            dict(
                zip(*np.unique(data['num' + str(i + 1)], return_counts=True)))
            .items(),
            key=lambda e: e[1],
            reverse=True)
        tongji.append(sorted([x[0] for x in tongJi30]))
    print str(int(lists[(j + 1) * 5]['_id'])) + '~' + str(
        int(lists[(j + 1) * 5]['_id']) + 4) + ':' + str(tongji)

    for m in range((j + 1) * 5, (j + 2) * 5):
        if m > len(lists) - 1:
            break

        count = 0
        for n in range(5):
            if lists[m]['num' + str(n + 1)] in tongji[n]:
                count += 1
        print lists[m]['_id'] + ':5--->' + str(count)

    print '----------------------------------------------'