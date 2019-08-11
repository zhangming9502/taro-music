import { ComponentClass } from 'react'
import { AtSearchBar, AtIcon } from 'taro-ui'
import Taro, { Component, Config } from '@tarojs/taro'
import classnames from 'classnames'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import api from '../../services/api'
import './index.scss'


type PageState = {
  searchValue: string,
  hotList: Array<{
    searchWord: string,
    score: number,
    iconUrl: string,
    content: string,
    iconType: number
  }>,
  historyList: Array<{
    searchWord: string
  }>
}

class Page extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '搜索'
  }

  constructor (props) {
    super(props)
    this.state = {
      searchValue: '',
      hotList: [],
      historyList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getHotSearch()
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  searchTextChange() {

  }

  searchResult() {
    
  }

  getHotSearch() {
    api.get('/search/hot/detail', {
    }).then((res) => {
      if (res.data && res.data.data) {
        this.setState({
          hotList: res.data.data
        })
      }
    })
  }


  render () {
    const { searchValue, hotList, historyList } = this.state
    return (
      <View className='search_container'>
        <AtSearchBar
          actionName='搜一下'
          value={searchValue}
          onChange={this.searchTextChange.bind(this)}
          onActionClick={this.searchResult.bind(this)}
          className='search__input'
        />
        <ScrollView className='search_content' scrollY>
          {
            historyList.length ? <View className='search__history'>
              <View className='search__history__title'>
                <Text className='search__history__title__label'>
                  搜索历史
                </Text>
                <AtIcon prefixClass='fa' value='trash-o' size='20' color='#cccccc' className='search__history__title__icon'></AtIcon>
              </View>
              <View className='search__history__list'>

              </View>
            </View> : ''
          }
          <View className='search__hot'>
            <View className='search__history__title'>
              <Text className='search__history__title__label'>
                热搜榜
              </Text>
            </View>
            <View className='search__hot__list'>
              {
                hotList.map((item, index) => <View className='search__hot__list__item flex flex-align-center'>
                  <View className={
                    classnames({
                      search__hot__list__item__index: true,
                      spec: index <= 2
                    })
                  }>
                    {index + 1}
                  </View>
                  <View className='search__hot__list__item__info'>
                    <View className="flex flex-align-center">
                      <Text className={
                        classnames({
                          search__hot__list__item__info__title: true,
                          spec: index <= 2
                        })
                      }>
                        {item.searchWord}
                      </Text> 
                      <Text className='search__hot__list__item__info__score'>
                        {item.score}
                      </Text>
                      {
                        item.iconUrl ? <Image src={item.iconUrl} mode="widthFix" className={
                          classnames({
                            search__hot__list__item__info__icon: true,
                            spec: item.iconType === 5
                          })
                        }/> : ''
                      }
                    </View>
                    <View className='search__hot__list__item__info__desc'>
                      {item.content}
                    </View>
                  </View>
                </View>)
              }
            </View>
          </View>
        </ScrollView>   
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass