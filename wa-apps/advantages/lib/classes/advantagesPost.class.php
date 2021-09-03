<?php

class advantagesPost {

    protected $app;

    /**
     * advantagesPostSaveController constructor.
     * @throws waException
     */
    public function __construct()
    {
        $this->app = wa()->getApp();
    }

    public function path($dir = '/')
    {
        return wa()->getAppPath($dir, $this->app);
    }

    public function relativePath()
    {
        return wa()->getAppStaticUrl($this->app);
    }

    public function getImagesPath($name = '')
    {
        if(!$name)
            return false;

        return $this->relativePath() . 'img/uploaded/' . $name;
    }

}
