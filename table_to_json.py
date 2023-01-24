import pandas as pd
import numpy as np
import json


def table_to_json(tableName):
    table = pd.read_csv(f'./tables/{tableName}.csv')
    # table = pd.read_csv(f'./tables/tv_imdb_genre_rank.csv')

    first_row = {}
    for column in table.columns:
        first_row[column] = [0]
    first_row['rating'] = 1.0
    table = pd.concat([pd.DataFrame(first_row), table])

    last_row = {}
    for column in table.columns:
        last_row[column] = [100]
    last_row['rating'] = 10.0
    table = pd.concat([table, pd.DataFrame(last_row)])

    row = {}
    for column in table.columns:
        row[column] = [np.nan]
    for i in range(10,101,1):
        if i/10 not in table.rating.to_list():
            row['rating'] = [i/10]
            table = pd.concat([table, pd.DataFrame(row)])

    table = table.sort_values(['rating']).reset_index().drop(['index'], axis=1)
    table.interpolate(method='index', inplace=True)
    table = table.round(1)

    genres = list(table.columns[1:])
    ratings = table['rating']

    genre_dict = {}

    for genre in genres:
        genre_dict[genre] = {}
        for i in range(0, len(ratings)):
            rating = ratings[i]
            rank = table[genre][i]
            if not np.isnan(rank):
                genre_dict[genre][rating] = rank

    # json_pretty = json.dumps(genre_dict, indent=4)

    with open(f'./json/{tableName}.json', 'w') as outfile:
        json.dump(genre_dict, outfile)

table_names = ['imdb_genre_rank', 'tv_imdb_genre_rank']
for table in table_names:
    table_to_json(table)
