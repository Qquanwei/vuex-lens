* 开始你的优雅状态管理

  因为vue内建类型的特性使得写代码的时候失去了很多JavaScript强大的功能。特别是喜欢functional的同学在处理列表时只能用蹩脚的vue.array定义的方法解决问题。这些都给我们操作数据(大部份时列表数据)时带来不可忽视的开发体验。这也是vuex-lens存在的原因，用一种更加优雅的方式去解决数据更新问题。

  lenses为一个古老的functional programming概念，这里不作太多解释了，如果没使用过的同学下面找了一些资料。

  https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5

  http://fluffynukeit.com/how-functional-programming-lenses-work/

  这里我留言了一个通俗解释  http://functional-programming.cn/t/topic/60/2?u=qquanwei


* 安装

```
npm install vuex-lens --save
```

* 例子


** 创建lenses

```
import { propLens, lens } from 'vuex-lens';

const nameL = propLens('name');
const nameL = lens((obj) => obj.name, (value, obj) => obj.name = value);
```

** 获取值

```

import { get } from 'vuex-lens';

const obj = { name: 'Alice' };
const name = get(nameL, obj);

console.log(name)  // -> Alice
```

** 简单写入

```
import { set } from 'vuex-lens';

const obj = { name: 'Alice' };

set(nameL, 'Bob', obj); // 返回obj相同的对象, 此时会产生副作用 obj.name 已经被修改，会触发vue的依赖更新

console.log(obj.name) // -> Bob
```


** transformer

```

import { over } from 'vuex-lens';
import { difference } from 'lodsh/difference';

const differencer = (a) => (b) => difference(b, a);

const array1 = [1,2,3,4,5,6,7,8,9];

const obj = {
  list: array1
};

const array2 = [3,5,6];

// 想实现的功能是 array1 - array2. 也就是difference(array1, array2);


const listL = propLens('list');

over(listL, differencer(array2), obj); // 此时obj.list为减去3,5,6的list1数组,且会触发vue的依赖更新。
```

** form 的更新


```
import { lensToVueLens, lens } from 'vuex-lens';
```
