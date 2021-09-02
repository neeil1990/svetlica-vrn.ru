<?php

class shopNamesPlugin extends shopPlugin
{
    /**
     * shopNamesPlugin constructor.
     */
    public function __construct()
    {
        $this->addJs('wa-apps/shop/plugins/names/js/names.js', false);
    }

    static public function name($id)
    {
        $model = new shopNamesPluginModel();
        $data = $model->getById($id);

        return $data['name'] ?: null;
    }

    public function backendCategoryDialog($category)
    {
        $model = new shopNamesPluginModel();
        $db = $model->getById($category['id']);
        return $this->htmlTemplate('Название меню', [
            'name' => 'names',
            'value' => ifset($db['name']),
            'class' => 'large long s-full-width-input',
            'data-id' => $category['id'],
            'onkeyup' => '(new Names()).record(this)'
        ]);
    }

    public function htmlTemplate($name, $params)
    {
        return $this->template($name, $params);
    }

    protected function template($name, $params = [])
    {
        return '<div class="field">' .$this->templateTitle($name). '<div class="value">'. $this->input($params) .'</div></div>';
    }

    protected function input($params = [])
    {
        $attributes = '';
        foreach ($params as $k => $p)
            $attributes .= $k. '="' .$p. '" ';

        return '<input type="text" '. $attributes .'>';
    }

    protected function templateTitle($name)
    {
        return '<div class="name">' .$name. '</div>';
    }
}
