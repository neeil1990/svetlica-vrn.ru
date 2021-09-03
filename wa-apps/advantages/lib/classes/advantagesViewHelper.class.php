<?php

/**
 * Class advantagesViewHelper
 * @property-read shopCart $cart
 * @property-read shopCustomer $customer
 */
class advantagesViewHelper extends waAppViewHelper
{
    static public function show(array $data)
    {
        if(!$data['params']['advantages'])
            return false;

        $model = new advantagesModel();
        $view = wa()->getView();

        $ids = explode(',', $data['params']['advantages']);
        $advantages = $model->getByField('id', $ids, true);
        $advantages = array_map(function ($val){
            $val['img'] = wa()->getAppStaticUrl('advantages') . 'img/uploaded/' . $val['img'];
            return $val;
        }, $advantages);

        $view->assign(compact('advantages'));
        return $view->fetch(wa()->getAppPath('templates/frontend.html', 'advantages'));
    }
}
