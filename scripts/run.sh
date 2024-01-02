if [ -d "depoly" ]; then
    cd deploy
    docker-compose down
    cd .. && rm -rf ./build
fi
tar -xvf deploy.tar
rm -rf deploy.tar
cd build
docker-compose up -d --build
