Binding Relations
=================

You can define relations between stores. After binding, stores will be
triggered automatically.

### Usage

```javascript
@bind(RelatedStore, itemPropertyName)

// or

@bind(RelatedStore, propertyGetterFunction)

// or

Store.bind(RelatedStore, itemPropertyName)
```

### Example

```javascript
// file article-store.js

import { store, bind } from 'hacksaw';
import CommentStore from './comment-store';

@store class ArticleStore {}

class ArticleModel {
  get comments() {
    return CommentStore.all.filter(comment => comment.article_id);
  }
}
```
---

```javascript
// file comment-store.js

import { store, bind } from 'hacksaw';
import ArticleStore from './article-store';

@bind(ArticleStore, 'article_id')
@store class CommentStore {}
```
---

```javascript
ArticleStore.listen(() => console.log('articles triggered'));
CommentStore.listen(() => console.log('comments triggered'));

ArticleStore.put([{ id: 1, title: 'item1' }, { id: 2, title: 'item2' }]);
// articles triggered

CommentStore.put({ id: 1, body: 'hello', article_id: 1 });
// comments triggered
// articles triggered

CommentStore.put({ id: 1, body: 'another' });
// comments triggered
// articles triggered

ArticleStore.put({ id: 1, title: 'another title' });
// articles triggered
// comments triggered
```
