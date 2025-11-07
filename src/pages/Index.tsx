import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  price: number;
  income: number;
  owned: number;
  icon: string;
  description: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  goal: number;
  current: number;
  completed: boolean;
  icon: string;
}

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [incomePerSecond, setIncomePerSecond] = useState(0);
  const [clickPower, setClickPower] = useState(1);

  const [realEstate, setRealEstate] = useState<Asset[]>([
    { id: '1', name: 'Студия', price: 100, income: 1, owned: 0, icon: 'Home', description: '+1₽/сек' },
    { id: '2', name: 'Квартира', price: 500, income: 5, owned: 0, icon: 'Building2', description: '+5₽/сек' },
    { id: '3', name: 'Пентхаус', price: 2500, income: 30, owned: 0, icon: 'Castle', description: '+30₽/сек' },
    { id: '4', name: 'Особняк', price: 10000, income: 150, owned: 0, icon: 'Hotel', description: '+150₽/сек' },
  ]);

  const [vehicles, setVehicles] = useState<Asset[]>([
    { id: '1', name: 'Велосипед', price: 50, income: 0.5, owned: 0, icon: 'Bike', description: '+0.5₽/сек' },
    { id: '2', name: 'Мотоцикл', price: 300, income: 3, owned: 0, icon: 'Bike', description: '+3₽/сек' },
    { id: '3', name: 'Седан', price: 1500, income: 20, owned: 0, icon: 'Car', description: '+20₽/сек' },
    { id: '4', name: 'Спорткар', price: 8000, income: 100, owned: 0, icon: 'Car', description: '+100₽/сек' },
    { id: '5', name: 'Яхта', price: 50000, income: 800, owned: 0, icon: 'Ship', description: '+800₽/сек' },
  ]);

  const [upgrades] = useState([
    { id: '1', name: 'Усилитель кликов x2', price: 200, multiplier: 2, icon: 'Zap' },
    { id: '2', name: 'Усилитель кликов x5', price: 1000, multiplier: 5, icon: 'Flame' },
    { id: '3', name: 'Усилитель кликов x10', price: 5000, multiplier: 10, icon: 'Sparkles' },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', name: 'Первый клик', description: 'Сделать 1 клик', goal: 1, current: 0, completed: false, icon: 'MousePointer2' },
    { id: '2', name: 'Начинающий', description: 'Сделать 100 кликов', goal: 100, current: 0, completed: false, icon: 'Target' },
    { id: '3', name: 'Любитель', description: 'Сделать 1000 кликов', goal: 1000, current: 0, completed: false, icon: 'Award' },
    { id: '4', name: 'Первый дом', description: 'Купить первую недвижимость', goal: 1, current: 0, completed: false, icon: 'Home' },
    { id: '5', name: 'Миллионер', description: 'Заработать 1,000,000₽', goal: 1000000, current: 0, completed: false, icon: 'TrendingUp' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + incomePerSecond / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [incomePerSecond]);

  useEffect(() => {
    const totalIncome = [...realEstate, ...vehicles].reduce((sum, asset) => sum + asset.income * asset.owned, 0);
    setIncomePerSecond(totalIncome);
  }, [realEstate, vehicles]);

  useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === '1' || ach.id === '2' || ach.id === '3') {
        const newCurrent = totalClicks;
        if (newCurrent >= ach.goal && !ach.completed) {
          toast.success(`🏆 Достижение: ${ach.name}`);
          return { ...ach, current: newCurrent, completed: true };
        }
        return { ...ach, current: newCurrent };
      }
      if (ach.id === '5') {
        if (balance >= ach.goal && !ach.completed) {
          toast.success(`🏆 Достижение: ${ach.name}`);
          return { ...ach, current: balance, completed: true };
        }
        return { ...ach, current: balance };
      }
      return ach;
    }));
  }, [totalClicks, balance]);

  const handleClick = () => {
    setBalance(prev => prev + clickPower);
    setTotalClicks(prev => prev + 1);
  };

  const buyAsset = (asset: Asset, type: 'realestate' | 'vehicle') => {
    if (balance >= asset.price) {
      setBalance(prev => prev - asset.price);
      
      if (type === 'realestate') {
        setRealEstate(prev => prev.map(item => 
          item.id === asset.id 
            ? { ...item, owned: item.owned + 1, price: Math.floor(item.price * 1.15) }
            : item
        ));
        const totalRealEstate = realEstate.reduce((sum, item) => sum + item.owned, 0) + 1;
        if (totalRealEstate === 1) {
          setAchievements(prev => prev.map(ach => 
            ach.id === '4' ? { ...ach, current: 1, completed: true } : ach
          ));
          toast.success('🏆 Достижение: Первый дом');
        }
      } else {
        setVehicles(prev => prev.map(item => 
          item.id === asset.id 
            ? { ...item, owned: item.owned + 1, price: Math.floor(item.price * 1.15) }
            : item
        ));
      }
      
      toast.success(`Куплено: ${asset.name}`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const buyUpgrade = (upgrade: any) => {
    if (balance >= upgrade.price) {
      setBalance(prev => prev - upgrade.price);
      setClickPower(prev => prev * upgrade.multiplier);
      toast.success(`Куплено: ${upgrade.name}`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">FINANCIAL EMPIRE</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Icon name="Wallet" size={20} className="mr-2" />
              Баланс: {formatNumber(balance)}₽
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="TrendingUp" size={20} className="mr-2" />
              {incomePerSecond.toFixed(1)}₽/сек
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="Zap" size={20} className="mr-2" />
              Клик: {clickPower}₽
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="clicker" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="clicker">
              <Icon name="MousePointer2" size={16} className="mr-2" />
              Кликер
            </TabsTrigger>
            <TabsTrigger value="realestate">
              <Icon name="Home" size={16} className="mr-2" />
              Недвижимость
            </TabsTrigger>
            <TabsTrigger value="vehicles">
              <Icon name="Car" size={16} className="mr-2" />
              Транспорт
            </TabsTrigger>
            <TabsTrigger value="shop">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Icon name="Trophy" size={16} className="mr-2" />
              Достижения
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="rating">
              <Icon name="Users" size={16} className="mr-2" />
              Рейтинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clicker">
            <Card className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Зарабатывай деньги</h2>
              <p className="text-muted-foreground mb-8">Кликай на кнопку для заработка</p>
              <Button 
                size="lg" 
                onClick={handleClick}
                className="w-64 h-64 rounded-full text-3xl font-bold hover:scale-105 transition-transform"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon name="DollarSign" size={80} />
                  <span>+{clickPower}₽</span>
                </div>
              </Button>
              <div className="mt-8 text-sm text-muted-foreground">
                Всего кликов: {totalClicks.toLocaleString()}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="realestate">
            <div className="grid gap-4 md:grid-cols-2">
              {realEstate.map(asset => (
                <Card key={asset.id} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name={asset.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{asset.description}</p>
                      </div>
                    </div>
                    {asset.owned > 0 && (
                      <Badge variant="secondary">{asset.owned}</Badge>
                    )}
                  </div>
                  <Button 
                    onClick={() => buyAsset(asset, 'realestate')}
                    className="w-full"
                    disabled={balance < asset.price}
                  >
                    Купить за {formatNumber(asset.price)}₽
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="grid gap-4 md:grid-cols-2">
              {vehicles.map(asset => (
                <Card key={asset.id} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name={asset.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{asset.description}</p>
                      </div>
                    </div>
                    {asset.owned > 0 && (
                      <Badge variant="secondary">{asset.owned}</Badge>
                    )}
                  </div>
                  <Button 
                    onClick={() => buyAsset(asset, 'vehicle')}
                    className="w-full"
                    disabled={balance < asset.price}
                  >
                    Купить за {formatNumber(asset.price)}₽
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shop">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upgrades.map(upgrade => (
                <Card key={upgrade.id} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={upgrade.icon as any} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{upgrade.name}</h3>
                    </div>
                  </div>
                  <Button 
                    onClick={() => buyUpgrade(upgrade)}
                    className="w-full"
                    disabled={balance < upgrade.price}
                  >
                    Купить за {formatNumber(upgrade.price)}₽
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`p-6 ${achievement.completed ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${achievement.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon name={achievement.icon as any} size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <Progress value={(achievement.current / achievement.goal) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatNumber(achievement.current)} / {formatNumber(achievement.goal)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Статистика игры</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="MousePointer2" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего кликов</p>
                    <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Home" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Недвижимость</p>
                    <p className="text-2xl font-bold">{realEstate.reduce((sum, item) => sum + item.owned, 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Car" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Транспорт</p>
                    <p className="text-2xl font-bold">{vehicles.reduce((sum, item) => sum + item.owned, 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Доход/сек</p>
                    <p className="text-2xl font-bold">{incomePerSecond.toFixed(1)}₽</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Trophy" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Достижения</p>
                    <p className="text-2xl font-bold">
                      {achievements.filter(a => a.completed).length}/{achievements.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Wallet" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Текущий баланс</p>
                    <p className="text-2xl font-bold">{formatNumber(balance)}₽</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rating">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Топ игроков</h2>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Ты', balance: Math.floor(balance), icon: 'Crown' },
                  { rank: 2, name: 'Игрок #2', balance: 850000, icon: 'Medal' },
                  { rank: 3, name: 'Игрок #3', balance: 720000, icon: 'Award' },
                  { rank: 4, name: 'Игрок #4', balance: 650000, icon: 'Star' },
                  { rank: 5, name: 'Игрок #5', balance: 580000, icon: 'Star' },
                ].map(player => (
                  <div key={player.rank} className={`flex items-center gap-4 p-4 rounded-lg border ${player.rank === 1 ? 'bg-primary/10 border-primary' : 'bg-card'}`}>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                      {player.rank}
                    </div>
                    <Icon name={player.icon as any} size={24} className={player.rank === 1 ? 'text-primary' : 'text-muted-foreground'} />
                    <div className="flex-1">
                      <p className="font-bold">{player.name}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">{formatNumber(player.balance)}₽</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
