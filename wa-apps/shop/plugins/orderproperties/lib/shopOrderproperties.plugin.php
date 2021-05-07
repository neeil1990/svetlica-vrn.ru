<?php

class shopOrderpropertiesPlugin extends shopPlugin
{
    public static function getOrderProperties($product)
    {
        $view = wa()->getView();
        $view->assign('product', $product);

        return $view->fetch($_SERVER['DOCUMENT_ROOT'] . '/wa-apps/shop/plugins/orderproperties/templates/frontend.html');
    }

    public function cartAdd($item)
    {
        $data = waRequest::post();
        session_start();

        $_SESSION['orderproperties'][$data['product_id']][$data['sku_id']] = $data['order_prop'];
    }

    public function orderActionCreate($params)
    {
        $order_id = $params['order_id'];
        $order_model = new shopOrderModel();
        $order = $order_model->getOrder($order_id);
        foreach ($order['items'] as $inc => &$item){

            foreach ($_SESSION['orderproperties'][$item['product_id']][$item['sku_id']] as $name => $params){
                $item['name'] .= ' ' . $name . ' = ' .$params . '; ';
            }
        }
        $order_model->update($order, $order['id']);

        unset($_SESSION['orderproperties']);
    }
}
